// src/components/properties/PropertyForm.jsx
import { useForm } from "react-hook-form";

export default function PropertyForm({ onSubmit, defaultValues = {} }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-6 border rounded-lg"
    >
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full border rounded-md p-2"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Price</label>
        <input
          type="number"
          {...register("price", { required: "Price is required" })}
          className="w-full border rounded-md p-2"
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Location</label>
        <input
          {...register("location", { required: "Location is required" })}
          className="w-full border rounded-md p-2"
        />
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Save Property
      </button>
    </form>
  );
}
