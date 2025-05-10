import React from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ContactProps {
  title?: string;
  subtitle?: string;
  onSubmit?: (data: ContactFormData) => void;
  className?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact = ({
  title = "Get In Touch",
  subtitle = "Have questions or feedback? We'd love to hear from you!",
  onSubmit,
  className,
}: ContactProps) => {
  const [formData, setFormData] = React.useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={cn("w-full py-16 bg-white dark:bg-gray-800", className)}
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-300 text-center mb-12">
              {subtitle}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export { Contact };
