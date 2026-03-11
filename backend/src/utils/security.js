export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validateFileType(ext) {
  return [".csv", ".xlsx"].includes(ext);
}

export function configureCors({ frontendUrl }) {
  const allowedOrigins = [];

  if (frontendUrl) {
    allowedOrigins.push(frontendUrl);
  }

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };
}

