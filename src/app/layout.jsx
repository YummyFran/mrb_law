import ClientLayout from "../components/client/ClientLayout";
import AttorneyLayout from "../components/attorney/AttorneyLayout";
import { AuthProvider } from "../contexts/AuthContext";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import "./globals.css";


export const metadata = {
  title: "MRB Law Firm",
  description: "Legal Filing System",
};

export default async function RootLayout({ children }) {
  const cookie = await cookies()
  const token = cookie.get("token")?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  let user = null

  if(token) {
    const { payload } = await jwtVerify(token, secret)

    user = payload
  }

  return (
    <html lang="en">
      <head>
        {/* Font Awesome for icons used across the dashboard */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-gray-100 text-gray-900 min-h-screen">
        <AuthProvider>
          {
            !user ? 
              children :
            user?.userType == "client" ?
              <ClientLayout>{children}</ClientLayout>
            :
            user?.userType == "attorney" &&
              <AttorneyLayout>{children}</AttorneyLayout>
          }
        </AuthProvider>
      </body>
    </html>
  );
}
