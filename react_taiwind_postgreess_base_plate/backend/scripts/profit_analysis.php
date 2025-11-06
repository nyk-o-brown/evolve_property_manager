<?php
/**
 * Property Profit/Loss Analysis Script
 * 
 * Usage:
 * php profit_analysis.php [property_id] [start_date] [end_date]
 * 
 * Examples:
 * php profit_analysis.php 1 2025-10-01 2025-10-31
 * php profit_analysis.php 1 (uses last month)
 * php profit_analysis.php (all properties, last month)
 */

// Include database configuration
require_once __DIR__ . '/../config/Database.php';

class ProfitAnalysisScript {
    private $conn;
    private $propertyId;
    private $startDate;
    private $endDate;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Parse command line arguments
     */
    public function parseArguments($argv) {
        // Parse property ID (optional)
        $this->propertyId = isset($argv[1]) && is_numeric($argv[1]) ? (int)$argv[1] : null;
        
        // Parse date range
        if (isset($argv[2]) && isset($argv[3])) {
            $this->startDate = $argv[2];
            $this->endDate = $argv[3];
        } else {
            // Default to last month
            $this->startDate = date('Y-m-01', strtotime('first day of last month'));
            $this->endDate = date('Y-m-t', strtotime('last day of last month'));
        }

        // Validate dates
        if (!$this->isValidDate($this->startDate) || !$this->isValidDate($this->endDate)) {
            throw new Exception("Invalid date format. Use YYYY-MM-DD");
        }
    }

    /**
     * Validate date format
     */
    private function isValidDate($date) {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }

    /**
     * Calculate total income for the period
     */
    private function calculateIncome() {
        $sql = "SELECT 
                    COALESCE(SUM(CASE WHEN status IN ('early', 'late') THEN amount ELSE 0 END), 0) as completed_income,
                    COALESCE(SUM(CASE WHEN status = 'incomplete' THEN amount ELSE 0 END), 0) as pending_income,
                    COALESCE(SUM(CASE WHEN status IN ('early', 'late') THEN amount ELSE 0 END), 0) as total_income,
                    COUNT(CASE WHEN status = 'early' THEN 1 END) as early_payments,
                    COUNT(CASE WHEN status = 'late' THEN 1 END) as late_payments,
                    COUNT(CASE WHEN status = 'incomplete' THEN 1 END) as incomplete_payments
                FROM payments
                WHERE date BETWEEN :start_date AND :end_date";
        
        if ($this->propertyId) {
            $sql .= " AND property_ID = :property_id";
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':start_date', $this->startDate);
        $stmt->bindParam(':end_date', $this->endDate);
        
        if ($this->propertyId) {
            $stmt->bindParam(':property_id', $this->propertyId);
        }

        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get payment breakdown by payment method
     */
    private function getPaymentMethods() {
        $sql = "SELECT 
                    payment_information,
                    COUNT(*) as count,
                    SUM(amount) as total
                FROM payments
                WHERE date BETWEEN :start_date AND :end_date
                AND status IN ('early', 'late')";
        
        if ($this->propertyId) {
            $sql .= " AND property_ID = :property_id";
        }

        $sql .= " GROUP BY payment_information";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':start_date', $this->startDate);
        $stmt->bindParam(':end_date', $this->endDate);
        
        if ($this->propertyId) {
            $stmt->bindParam(':property_id', $this->propertyId);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Calculate expenses by account/category
     */
    private function calculateExpenses() {
        $sql = "SELECT 
                    account,
                    COALESCE(SUM(amount), 0) as total,
                    COUNT(*) as count
                FROM expenses
                WHERE date BETWEEN :start_date AND :end_date";
        
        if ($this->propertyId) {
            $sql .= " AND property_ID = :property_id";
        }

        $sql .= " GROUP BY account ORDER BY total DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':start_date', $this->startDate);
        $stmt->bindParam(':end_date', $this->endDate);
        
        if ($this->propertyId) {
            $stmt->bindParam(':property_id', $this->propertyId);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Format currency
     */
    private function formatCurrency($amount) {
        return 'KSh ' . number_format($amount, 2);
    }

    /**
     * Format category name
     */
    private function formatCategory($category) {
        return ucwords(str_replace('_', ' ', $category));
    }

    /**
     * Generate and display the report
     */
    public function generateReport() {
        echo "\n";
        echo str_repeat('=', 80) . "\n";
        echo "              PROPERTY PROFIT/LOSS ANALYSIS REPORT\n";
        echo str_repeat('=', 80) . "\n";
        
        // Report metadata
        $monthYear = date('M Y', strtotime($this->startDate));
        echo "Period: {$this->startDate} to {$this->endDate} ({$monthYear})\n";
        echo "Property ID: " . ($this->propertyId ? $this->propertyId : "All Properties") . "\n";
        echo "Generated: " . date('Y-m-d H:i:s') . "\n";
        echo str_repeat('=', 80) . "\n\n";

        // Calculate income
        $income = $this->calculateIncome();
        
        echo "1. INCOME ANALYSIS\n";
        echo str_repeat('-', 80) . "\n";
        echo "   Completed Payments:         " . str_pad($this->formatCurrency($income['completed_income']), 20, ' ', STR_PAD_LEFT) . "\n";
        echo "   Pending Payments:           " . str_pad($this->formatCurrency($income['pending_income']), 20, ' ', STR_PAD_LEFT) . "\n";
        echo "   " . str_repeat('-', 76) . "\n";
        echo "   TOTAL INCOME (Received):    " . str_pad($this->formatCurrency($income['total_income']), 20, ' ', STR_PAD_LEFT) . "\n";
        echo "\n";

        // Payment status breakdown
        echo "   Payment Status Breakdown:\n";
        echo "   - Early Payments:  " . $income['early_payments'] . " payments\n";
        echo "   - Late Payments:   " . $income['late_payments'] . " payments\n";
        echo "   - Incomplete:      " . $income['incomplete_payments'] . " payments\n";
        echo "\n";

        // Payment methods
        $paymentMethods = $this->getPaymentMethods();
        if (!empty($paymentMethods)) {
            echo "   Payment Methods:\n";
            foreach ($paymentMethods as $method) {
                $methodName = $method['payment_information'] ?: 'Not specified';
                echo "   - " . str_pad($methodName . ":", 25) . 
                     str_pad($method['count'] . " payments", 15) . 
                     $this->formatCurrency($method['total']) . "\n";
            }
        }
        echo "\n";

        // Calculate expenses
        $expenses = $this->calculateExpenses();
        $totalExpenses = 0;

        echo "2. EXPENSES ANALYSIS\n";
        echo str_repeat('-', 80) . "\n";
        
        if (empty($expenses)) {
            echo "   No expenses recorded for this period.\n";
        } else {
            foreach ($expenses as $expense) {
                $categoryName = $this->formatCategory($expense['category']);
                $amount = (float)$expense['total'];
                $totalExpenses += $amount;
                echo "   " . str_pad($categoryName . ":", 35) . str_pad($this->formatCurrency($amount), 20, ' ', STR_PAD_LEFT) . "\n";
            }
        }
        
        echo "   " . str_repeat('-', 76) . "\n";
        echo "   TOTAL EXPENSES:             " . str_pad($this->formatCurrency($totalExpenses), 20, ' ', STR_PAD_LEFT) . "\n";
        echo "\n";

        // Calculate net profit/loss
        $netAmount = $income['total_income'] - $totalExpenses;
        $status = $netAmount >= 0 ? 'PROFIT' : 'LOSS';
        $statusSymbol = $netAmount >= 0 ? '✓' : '✗';

        echo str_repeat('=', 80) . "\n";
        echo "3. NET PROFIT/LOSS SUMMARY\n";
        echo str_repeat('=', 80) . "\n";
        echo "   Total Income (Received):    " . str_pad($this->formatCurrency($income['total_income']), 20, ' ', STR_PAD_LEFT) . "\n";
        echo "   Total Expenses:           - " . str_pad($this->formatCurrency($totalExpenses), 20, ' ', STR_PAD_LEFT) . "\n";
        echo "   " . str_repeat('-', 76) . "\n";
        echo "   NET {$status}:                " . str_pad($this->formatCurrency(abs($netAmount)), 20, ' ', STR_PAD_LEFT) . " {$statusSymbol}\n";
        
        // Show pending income separately
        if ($income['pending_income'] > 0) {
            echo "\n   Note: Pending/Incomplete:   " . str_pad($this->formatCurrency($income['pending_income']), 20, ' ', STR_PAD_LEFT) . " (not included)\n";
        }
        
        echo str_repeat('=', 80) . "\n";

        // Summary metrics
        echo "\n";
        echo "4. PERFORMANCE METRICS\n";
        echo str_repeat('-', 80) . "\n";
        
        if ($income['total_income'] > 0) {
            $expenseRatio = ($totalExpenses / $income['total_income']) * 100;
            $profitMargin = ($netAmount / $income['total_income']) * 100;
            
            echo "   Expense Ratio:              " . number_format($expenseRatio, 2) . "%\n";
            echo "   Profit Margin:              " . number_format($profitMargin, 2) . "%\n";
            
            // Payment timeliness
            $totalCompleted = $income['early_payments'] + $income['late_payments'];
            if ($totalCompleted > 0) {
                $onTimeRate = ($income['early_payments'] / $totalCompleted) * 100;
                echo "   On-Time Payment Rate:       " . number_format($onTimeRate, 2) . "%\n";
            }
            
            // Collection rate
            $totalExpected = $income['total_income'] + $income['pending_income'];
            if ($totalExpected > 0) {
                $collectionRate = ($income['total_income'] / $totalExpected) * 100;
                echo "   Collection Rate:            " . number_format($collectionRate, 2) . "%\n";
            }
        } else {
            echo "   No income recorded - metrics unavailable\n";
        }
        
        echo str_repeat('-', 80) . "\n\n";

        // Return summary data
        return [
            'total_income' => $income['total_income'],
            'pending_income' => $income['pending_income'],
            'total_expenses' => $totalExpenses,
            'net_profit_loss' => $netAmount,
            'status' => $status,
            'early_payments' => $income['early_payments'],
            'late_payments' => $income['late_payments'],
            'incomplete_payments' => $income['incomplete_payments']
        ];
    }

    /**
     * Run the analysis
     */
    public function run($argv) {
        try {
            $this->parseArguments($argv);
            $this->generateReport();
            exit(0);
        } catch (Exception $e) {
            echo "\n[ERROR] " . $e->getMessage() . "\n\n";
            $this->printUsage();
            exit(1);
        }
    }

    /**
     * Print usage instructions
     */
    private function printUsage() {
        echo "Usage:\n";
        echo "  php profit_analysis.php [property_id] [start_date] [end_date]\n\n";
        echo "Examples:\n";
        echo "  php profit_analysis.php 1 2025-10-01 2025-10-31  # Specific property and dates\n";
        echo "  php profit_analysis.php 1                         # Property 1, last month\n";
        echo "  php profit_analysis.php                           # All properties, last month\n\n";
        echo "Date format: YYYY-MM-DD\n";
    }
}

// Main execution
try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    $script = new ProfitAnalysisScript($conn);
    $script->run($argv);
    
} catch (Exception $e) {
    echo "\n[FATAL ERROR] " . $e->getMessage() . "\n";
    exit(1);
}