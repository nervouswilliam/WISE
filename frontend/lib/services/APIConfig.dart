import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:path/path.dart';

class Apiconfig {
  static String get baseUrl {
    // Choose the appropriate URL based on your build configuration
    // You can set a default environment or detect it from a build flag
    const String env = String.fromEnvironment('FLAVOR', defaultValue: 'dev');
    
    switch (env) {
      case 'prod':
        return dotenv.get('BASE_URL_PROD');
      case 'uat':
        return dotenv.get('BASE_URL_UAT');
      case 'dev':
      default:
        return dotenv.get('BASE_URL_DEV');
    }
  }

  // Default headers for all requests
  static Map<String, String> get _defaultHeaders => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Helper to get full endpoint URL
  static String getEndpoint(String path) {
    if (!path.startsWith('/')) {
      path = '/$path';
    }
    return '$baseUrl$path';
  }
  
  // GET request implementation
  static Future<dynamic> get(
    String path, {
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
  }) async {
    var url = getEndpoint(path);
    
    // Add query parameters if provided
    if (queryParameters != null && queryParameters.isNotEmpty) {
      final queryString = Uri(queryParameters: queryParameters.map(
        (key, value) => MapEntry(key, value.toString())
      )).query;
      url = '$url?$queryString';
    }
    
    try {
      final response = await http.get(
        Uri.parse(url),
        headers: {..._defaultHeaders, ...?headers},
      );
      
      return _handleResponse(response);
    } catch (e) {
      return _handleError(e);
    }
  }
  
  // POST request implementation with flexible body types
  static Future<dynamic> post(
    String path, {
    dynamic body,
    Map<String, String>? headers,
    String contentType = 'application/json',
  }) {
    return Future.sync(() async {
      final url = getEndpoint(path);
      final requestHeaders = {..._defaultHeaders, ...?headers};
      
      if (contentType != 'application/json') {
        requestHeaders['Content-Type'] = contentType;
      }
      
      try {
        http.Response response;

        if (body is Map<String, dynamic> && contentType == 'application/json') {
          response = await http.post(
            Uri.parse(url),
            headers: requestHeaders,
            body: jsonEncode(body),
          );
        } else if (contentType == 'application/x-www-form-urlencoded' && body is Map) {
          response = await http.post(
            Uri.parse(url),
            headers: requestHeaders,
            body: body.map((key, value) => MapEntry(key.toString(), value.toString())),
          );
        } else if (body is String) {
          response = await http.post(
            Uri.parse(url),
            headers: requestHeaders,
            body: body,
          );
        } else if (body is List<int>) {
          response = await http.post(
            Uri.parse(url),
            headers: requestHeaders,
            body: body,
          );
        } else if (body == null) {
          response = await http.post(
            Uri.parse(url),
            headers: requestHeaders,
          );
        } else {
          response = await http.post(
            Uri.parse(url),
            headers: requestHeaders,
            body: jsonEncode(body),
          );
        }
        print("response: ${response.body}");
        return _handleResponse(response);
      } catch (e) {
        return _handleError(e);
      }
    });
  }

  
  // Multipart request for file uploads
//   static Future<dynamic> postMultipart(
//   String path, {
//   required Map<String, String> fields,
//   required File file, // Accepts a single image file
//   Map<String, String>? headers,
// }) async {
//   final url = getEndpoint(path);

//   try {
//     var request = http.MultipartRequest('POST', Uri.parse(url));

//     // Add headers
//     request.headers.addAll({..._defaultHeaders, ...?headers});
//     request.headers.remove('Content-Type'); // Let MultipartRequest handle it

//     // Add text fields (if any)
//     request.fields.addAll(fields);

//     // Attach image file
//     request.files.add(
//       await http.MultipartFile.fromPath(
//         'file', // This should match @RequestParam("file") in Spring Boot
//         file.path,
//         filename: basename(file.path),
//       ),
//     );

//     // Send the request
//     var streamedResponse = await request.send();
//     var response = await http.Response.fromStream(streamedResponse);

//     return _handleResponse(response);
//   } catch (e) {
//     return _handleError(e);
//   }
// }

static Future<dynamic> postMultipart(String url, {Map<String, String>? fields, Uint8List? fileData, String? filename}) async {
  var finalUrl = getEndpoint(url);
  var request = http.MultipartRequest("POST", Uri.parse(finalUrl));

  // Add fields if needed
  if (fields != null) {
    fields.forEach((key, value) {
      request.fields[key] = value;
    });
  }

  // Convert Uint8List to MultipartFile
  if (fileData != null && filename != null) {
    request.files.add(http.MultipartFile.fromBytes(
      'file', // Key name used in backend
      fileData,
      filename: filename,
    ));
  }

  var streamedResponse = await request.send();
  return await http.Response.fromStream(streamedResponse);
}

  
  // PUT request implementation
  static Future<dynamic> put(
    String path, {
    dynamic body,
    Map<String, String>? headers,
    String contentType = 'application/json',
  }) async {
    final url = getEndpoint(path);
    final requestHeaders = {..._defaultHeaders, ...?headers};
    
    if (contentType != 'application/json') {
      requestHeaders['Content-Type'] = contentType;
    }
    
    try {
      final bodyData = body is Map<String, dynamic> && contentType == 'application/json'
          ? jsonEncode(body)
          : body;
          
      final response = await http.put(
        Uri.parse(url),
        headers: requestHeaders,
        body: bodyData,
      );
      
      return _handleResponse(response);
    } catch (e) {
      return _handleError(e);
    }
  }
  
  // PATCH request implementation
  static Future<dynamic> patch(
    String path, {
    dynamic body,
    Map<String, String>? headers,
    String contentType = 'application/json',
  }) async {
    final url = getEndpoint(path);
    final requestHeaders = {..._defaultHeaders, ...?headers};
    
    if (contentType != 'application/json') {
      requestHeaders['Content-Type'] = contentType;
    }
    
    try {
      final bodyData = body is Map<String, dynamic> && contentType == 'application/json'
          ? jsonEncode(body)
          : body;
          
      final response = await http.patch(
        Uri.parse(url),
        headers: requestHeaders,
        body: bodyData,
      );
      
      return _handleResponse(response);
    } catch (e) {
      return _handleError(e);
    }
  }
  
  // DELETE request implementation
  static Future<dynamic> delete(
    String path, {
    dynamic body,
    Map<String, String>? headers,
  }) async {
    final url = getEndpoint(path);
    
    try {
      final response = await http.delete(
        Uri.parse(url),
        headers: {..._defaultHeaders, ...?headers},
        body: body is Map<String, dynamic> ? jsonEncode(body) : body,
      );
      
      return _handleResponse(response);
    } catch (e) {
      return _handleError(e);
    }
  }
  
  // Response handler
  static dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      try {
        return jsonDecode(response.body); // Ensure it's decoded
      } catch (e) {
        return response.body; // Return as a string if not JSON
      }
    } else {
      // Error response
      throw HttpException(
        statusCode: response.statusCode,
        message: response.body,
      );
    }
  }
  
  // Error handler
  static dynamic _handleError(dynamic error) {
    if (error is HttpException) {
      throw error;
    } else {
      throw HttpException(
        statusCode: 0,
        message: error.toString(),
      );
    }
  }
}

class HttpException implements Exception {
  final int statusCode;
  final String message;
  
  HttpException({required this.statusCode, required this.message});
  
  @override
  String toString() => 'HttpException: [$statusCode] $message';
}