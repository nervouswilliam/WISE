interface ErrorSchema {
  error_message: string;
  error_code: string;
}

interface ApiResponseSuccess<T> {
  success: true;
  data: T;
}

interface ApiResponseError {
  success: false;
  message: string;
}

type ApiResponse<T> = {
  output_schema?: T;
  error_schema: ErrorSchema;
};

export const ResponseHelper = <T,>(response: ApiResponse<T>): ApiResponseSuccess<T> | ApiResponseError => {
  const { output_schema, error_schema } = response;

  if (error_schema.error_code !== "S001") {
    console.error("Error from API:", error_schema.error_message);
    return { success: false, message: error_schema.error_message };
  }

  if (!output_schema) {
    console.error("Output schema missing from response");
    return { success: false, message: "Output schema missing" };
  }

  return { success: true, data: output_schema };
};
