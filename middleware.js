import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

  // Allow access to admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check if accessing admin routes
  if (pathname.startsWith("/admin")) {
    // Redirect to login if no token
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check if admin is active
    if (!token.isActive) {
      const loginUrl = new URL("/admin/login?error=inactive", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based route protection
    const adminRoutes = [
      "/admin/admins",
      "/admin/system",
      "/admin/audit",
    ];

    const managerRoutes = [
      "/admin/analytics",
      "/admin/reports",
    ];

    // Check admin-only routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (token.role !== "admin") {
        const dashboardUrl = new URL("/admin/dashboard?error=insufficient_permissions", req.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

    // Check manager+ routes
    if (managerRoutes.some(route => pathname.startsWith(route))) {
      if (!["admin", "manager"].includes(token.role)) {
        const dashboardUrl = new URL("/admin/dashboard?error=insufficient_permissions", req.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

    // Permission-based route protection
    const permissionRoutes = {
      "/admin/orders": "canViewOrders",
      "/admin/customers": "canViewCustomers",
      "/admin/analytics": "canViewAnalytics",
      "/admin/audit": "canViewAuditLog",
    };

    for (const [route, permission] of Object.entries(permissionRoutes)) {
      if (pathname.startsWith(route) && !token.permissions?.[permission]) {
        const dashboardUrl = new URL("/admin/dashboard?error=insufficient_permissions", req.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin login page without token
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        // Require token for all other admin routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};