import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AIChatWidget from "@/components/AIChatWidget";

// Lazy load all pages for fast initial load
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const HostingPage = lazy(() => import("./pages/HostingPage"));
const DomainsPage = lazy(() => import("./pages/DomainsPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ClientLoginPage = lazy(() => import("./pages/client/ClientLoginPage"));
const ClientDashboardLayout = lazy(() => import("./pages/client/ClientDashboardLayout"));
const DashboardOverview = lazy(() => import("./pages/client/DashboardOverview"));
const ClientHosting = lazy(() => import("./pages/client/ClientHosting"));
const ClientDomains = lazy(() => import("./pages/client/ClientDomains"));
const ClientInvoices = lazy(() => import("./pages/client/ClientInvoices"));
const ClientPayments = lazy(() => import("./pages/client/ClientPayments"));
const ClientSupport = lazy(() => import("./pages/client/ClientSupport"));
const ClientProfile = lazy(() => import("./pages/client/ClientProfile"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-sm gradient-primary flex items-center justify-center animate-pulse">
          <span className="text-primary-foreground font-heading font-bold">A</span>
        </div>
        <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full animate-[loading_1s_ease-in-out_infinite]" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/services/:slug" element={<Layout><ServiceDetailPage /></Layout>} />
            <Route path="/hosting" element={<Layout><HostingPage /></Layout>} />
            <Route path="/domains" element={<Layout><DomainsPage /></Layout>} />
            <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

            {/* Client */}
            <Route path="/client/login" element={<ClientLoginPage />} />
            <Route path="/client/dashboard" element={<ClientDashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="hosting" element={<ClientHosting />} />
              <Route path="domains" element={<ClientDomains />} />
              <Route path="invoices" element={<ClientInvoices />} />
              <Route path="payments" element={<ClientPayments />} />
              <Route path="support" element={<ClientSupport />} />
              <Route path="profile" element={<ClientProfile />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <AIChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
