export function errorHandler(err: any, req: any, res: any, next: any) {
  console.error("❌ Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
}