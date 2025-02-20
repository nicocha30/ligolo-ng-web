import { addToast } from "@heroui/react";
import { ApiResponse } from "@/types/apiresponse.ts";

export function handleApiResponse(jsonData: ApiResponse): void {
  if (jsonData && jsonData.message) {
    addToast({
      title: "Ligolo-ng",
      description: jsonData.message,
      color: "success"
    });
  }
  if (jsonData && jsonData.error) {
    addToast({
      title: "Ligolo-ng",
      description: jsonData.error,
      color: "danger"
    });
  }
}