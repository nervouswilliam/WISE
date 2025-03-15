import 'dart:convert';
class ResponseHelper {
  late Map<String, dynamic> _outputSchema;
  late String _errorCode;

  ResponseHelper._(this._outputSchema, this._errorCode);

  /// Parses JSON and initializes the private fields
  factory ResponseHelper.decodeJson(Map<String, dynamic> jsonData) {
    print("masuk 3");
    
    return ResponseHelper._(
      jsonData["output_schema"] ?? {}, 
      jsonData["error_schema"]?["error_code"] ?? "N/A",
    );
  }

  /// Returns only the error code
  String getErrorCode() {
    return _errorCode;
  }

  /// Returns the entire output_schema object
  Map<String, dynamic> getOutputSchema() {
    return _outputSchema;
  }
}