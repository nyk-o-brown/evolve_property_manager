#!/bin/bash
# Script to update PHP include paths for cPanel deployment
# This converts relative paths from local structure to production structure

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== PHP Include Path Migration Script ===${NC}"
echo "This script will update all PHP require/include statements for cPanel deployment."
echo ""

# Define source and destination patterns
declare -A REPLACEMENTS=(
    ["require_once '../../config/Database.php';"]="require_once '../config/Database.php';"
    ["require_once '../../models/"]="require_once '../models/"
    ["require_once '../../config/"]="require_once '../config/"
    ["require '../../config/Database.php';"]="require '../config/Database.php';"
    ["include_once '../../config/Database.php';"]="include_once '../config/Database.php';"
)

# Count successful updates
UPDATED_FILES=0
TOTAL_FILES=0

# Find and update all PHP files in the api directory
for php_file in $(find ./backend/api -name "*.php" -type f); do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    FILE_UPDATED=0
    
    # Create backup
    cp "$php_file" "${php_file}.backup"
    
    echo -e "${YELLOW}Processing: $php_file${NC}"
    
    # Update each pattern
    for old_pattern in "${!REPLACEMENTS[@]}"; do
        new_pattern="${REPLACEMENTS[$old_pattern]}"
        
        if grep -q "$old_pattern" "$php_file"; then
            sed -i "s|$(printf '%s\n' "$old_pattern" | sed -e 's/[\/&]/\\&/g')|$new_pattern|g" "$php_file"
            echo -e "${GREEN}  ✓ Updated: $old_pattern${NC}"
            FILE_UPDATED=1
        fi
    done
    
    if [ $FILE_UPDATED -eq 1 ]; then
        UPDATED_FILES=$((UPDATED_FILES + 1))
    fi
done

echo ""
echo -e "${GREEN}=== Migration Complete ===${NC}"
echo "Total files processed: $TOTAL_FILES"
echo "Total files updated: $UPDATED_FILES"
echo ""
echo -e "${YELLOW}Backup files created with .backup extension${NC}"
echo ""
echo "Next steps:"
echo "1. Review the changes in the updated PHP files"
echo "2. Test all API endpoints locally"
echo "3. If all looks good, delete the .backup files"
echo "4. Upload files to cPanel"
