import type { Addon, PlanCategory } from '../types'

export const PAGE = {
  title: 'Choose the Right Plan for Your Fire Safety Business or Premises',
  description:
    'Whether you are a Fire Safety Business, Premises manager, or Corporate, Buzaao offers flexible plans designed to simplify fire safety management, improve compliance, and help you grow.',
  footerNote:
    'The displayed plan prices are base prices in INR. Applicable GST and other statutory charges will be added as per the prevailing rules.',
}

export const CUSTOM_SOLUTION = {
  startsFrom: 'STARTS FROM',
  priceLabel: '₹1.50K*',
  title: 'Fully Customized Solution',
  features: 'All Modules • Custom Design • Business-Specific Features',
  whatsappNumber: '919512030101',
  whatsappLabel: 'WhatsApp This Estimate',
  note: '*Indicative starting price. Final estimate depends on modules and custom work.',
}

export const CORPORATE_SOLUTION = {
  kicker: 'CORPORATE SOLUTION',
  title: 'Built for 500+ branches & Multi-Location Operations',
  whatsappLabel: 'WhatsApp',
  cta: 'Get a precise quote',
}

export const REGISTRATION = {
  business: {
    label: 'Register your business now',
    url: 'https://service.buzaao.com/organization_registration/13120260831185252',
  },
  premises: {
    label: 'Register your building now',
    url: 'https://service.buzaao.com/client_registration/13120260831185252',
  },
} as const

function whatsappUrl(message: string) {
  return `https://wa.me/${CUSTOM_SOLUTION.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function customEstimateWhatsAppUrl() {
  return whatsappUrl(
    `Hi Buzaao, I want a fully customized business solution (starts from ${CUSTOM_SOLUTION.priceLabel.replace('*', '')}). Please share an estimate.`,
  )
}

export function corporateQuoteWhatsAppUrl() {
  return whatsappUrl(
    'Hi Buzaao, I need a corporate premises solution for 500+ branches and multi-location operations. Please share a precise quote.',
  )
}

export const ADDONS: Addon[] = [
  {
    id: 'corporate-login',
    name: 'Corporate Login',
    price: 60000,
    unit: 'year',
    category: 'business',
    description: 'Corporate-level access, management dashboard & business control',
  },
  {
    id: 'business-website',
    name: 'Business Website',
    price: 15000,
    unit: 'year',
    category: 'business',
    description: 'Professional business website with products & services',
  },
  {
    id: 'google-business-profile',
    name: 'Google Business Profile',
    price: 10000,
    unit: 'year',
    category: 'business',
    description: 'Google visibility, profile optimization & lead generation',
  },
  {
    id: 'social-media-toolkit',
    name: 'Social Media Toolkit',
    price: 35000,
    unit: 'year',
    category: 'business',
    description: 'Social media management, creatives, content & marketing tools',
  },
  {
    id: 'fire-safety-series',
    name: 'Fire Safety Series',
    price: 5000,
    unit: 'year',
    category: 'business',
    description: 'Fire-safety educational content & awareness tools',
  },
  {
    id: 'crm-module',
    name: 'CRM Module',
    price: 25000,
    unit: 'year',
    category: 'business',
    description: 'Leads, customers, follow-ups, enquiries & sales management',
  },
  {
    id: 'hrms-module',
    name: 'HRMS Module',
    price: 25000,
    unit: 'year',
    category: 'business',
    description: 'Employee, attendance, leave & HR management',
  },
  {
    id: 'accounts-module',
    name: 'Accounts Module',
    price: 25000,
    unit: 'year',
    category: 'business',
    description: 'Income, expenses, invoices, payments & financial tracking',
  },
  {
    id: 'fire-project-management',
    name: 'Fire Project Management',
    price: 25000,
    unit: 'year',
    category: 'business',
    description: 'Project planning, BOQ, tasks, materials, progress & project reporting',
  },
  {
    id: 'digital-qr',
    name: 'Digital QR Mapping',
    price: 25,
    unit: 'QR',
    category: 'premises',
    description: 'QR mapping + Product-wise Report + Floor-wise Report',
  },
  {
    id: 'glow-sticker-qr',
    name: 'Glow Sticker + QR',
    price: 55,
    unit: 'QR',
    category: 'premises',
    description: 'Glow sticker + QR + Product-wise Report + Floor-wise Report',
  },
]

export const PLAN_CATEGORIES: PlanCategory[] = [
  {
    id: 'business',
    title: 'Business Plans',
    subtitle:
      'Power your fire safety business with Buzaao — manage your business, services, customers, leads and growth, all from one platform. Choose a plan that fits your business size and goals; start simple, upgrade as you grow.',
    popularPlanId: 'growth',
    popularNote: 'Growth is our most popular plan for growing fire-safety businesses.',
    plans: [
      { id: 'starter', name: 'Starter', price: 4999, priceLabel: '₹4,999' },
      { id: 'growth', name: 'Growth', price: 9999, priceLabel: '₹9,999', popular: true },
      { id: 'professional', name: 'Professional', price: 20000, priceLabel: '₹20,000' },
      { id: 'enterprise', name: 'Enterprise', price: 50000, priceLabel: '₹50,000+' },
    ],
    features: [
      { name: 'Business Profile', values: { starter: true, growth: true, professional: true, enterprise: true } },
      { name: 'Buzaao Marketplace Listing', values: { starter: true, growth: true, professional: true, enterprise: true } },
      { name: 'Product Listing', values: { starter: '10', growth: '50', professional: 'Unlimited', enterprise: 'Unlimited' } },
      { name: 'Service Listing / Connect Option', values: { starter: false, growth: false, professional: '5', enterprise: '10' } },
      { name: 'Leads & Enquiries', values: { starter: true, growth: true, professional: true, enterprise: true } },
      { name: 'Quotation Management', values: { starter: false, growth: true, professional: true, enterprise: true } },
      { name: 'Customer Management', values: { starter: false, growth: true, professional: true, enterprise: true } },
      { name: 'AMC Management', values: { starter: false, growth: true, professional: true, enterprise: true } },
      { name: 'Service Management', values: { starter: false, growth: true, professional: true, enterprise: true } },
      { name: 'Digital Service Reports', values: { starter: false, growth: true, professional: true, enterprise: true } },
      { name: 'Client Management', values: { starter: false, growth: false, professional: '50', enterprise: '100' } },
      { name: 'Business Analytics', values: { starter: false, growth: true, professional: true, enterprise: true } },
      { name: 'Staff / Technician Management', values: { starter: false, growth: false, professional: '5', enterprise: '20' } },
      { name: 'WhatsApp Integration', values: { starter: false, growth: false, professional: true, enterprise: true } },
    ],
    faqs: [
      {
        question: 'What is included in the Buzaao Business Pricing Plans?',
        answer:
          'Each plan includes different levels of business listing, product & service management, leads, enquiries, quotations, customers, AMC, service management and business analytics.',
      },
      {
        question: 'Which plan is best for a new fire-safety business?',
        answer:
          'The Starter Plan is ideal for businesses that want to establish their digital presence and start receiving enquiries through Buzaao.',
      },
      {
        question: 'Which plan is recommended for a growing business?',
        answer:
          'The Growth Plan is recommended for businesses that want to manage leads, customers, quotations, AMC and service activities digitally.',
      },
      {
        question: 'What is the Professional Plan for?',
        answer:
          'The Professional Plan is designed for established fire-safety businesses requiring advanced business management, customer portals, technician management, reporting and automation.',
      },
      {
        question: 'What is the Enterprise Plan?',
        answer:
          'Enterprise is for larger companies requiring multiple branches, advanced ERP, integrations, customized dashboards and dedicated solutions.',
      },
      {
        question: 'Can I upgrade my plan later?',
        answer: 'Yes. You can upgrade your plan as your business grows and your requirements increase.',
      },
      {
        question: 'Are digital add-ons included in the plan?',
        answer:
          'Some features are included depending on the selected plan. Additional modules such as CRM, HRMS, Accounts, Website, Social Media Toolkit, Corporate Login and Fire Project Management can be purchased separately.',
      },
      {
        question: 'Can I purchase only the modules I need?',
        answer:
          'Yes. Buzaao follows a modular approach, allowing you to add specific digital solutions according to your business requirements.',
      },
      {
        question: 'Is WhatsApp integration included?',
        answer:
          'WhatsApp integration is available in selected plans and as an add-on. WhatsApp/API charges may apply separately.',
      },
      {
        question: 'Are GST and other government taxes included in the displayed price?',
        answer:
          'The displayed plan prices are base prices. Applicable GST and other statutory charges will be added as per the prevailing rules.',
      },
      {
        question: 'Is the pricing monthly or yearly?',
        answer: 'The listed Buzaao Business plans are annual subscription plans, unless otherwise specified.',
      },
      {
        question: 'Can I get a customized package?',
        answer:
          'Yes. Enterprise customers can get a customized package based on users, branches, modules, integrations and business requirements.',
      },
      {
        question: 'Do I get support and training?',
        answer: 'Yes. Support and onboarding are provided according to the selected plan and service package.',
      },
      {
        question: 'Can I add more users or branches?',
        answer: 'Yes. Additional users and branches can be added through applicable add-ons.',
      },
      {
        question: 'What happens when my subscription expires?',
        answer: 'You can renew your subscription to continue using the applicable Buzaao Business services and modules.',
      },
    ],
  },
  {
    id: 'premises',
    title: 'Premises Plans',
    subtitle:
      "Make your premises fire-safe, compliant & connected. Manage your building's fire safety, inspections, equipment, documents, AMC, compliance status and service records from one centralized platform.",
    popularPlanId: 'compliance',
    popularNote: 'Compliance is our most popular plan for single-building owners and facility managers.',
    plans: [
      { id: 'basic', name: 'Basic', price: 5000, priceLabel: '₹5,000' },
      { id: 'compliance', name: 'Compliance', price: 20000, priceLabel: '₹20,000', popular: true },
      { id: 'professional', name: 'Professional', price: 50000, priceLabel: '₹50,000' },
      { id: 'enterprise', name: 'Enterprise', price: 100000, priceLabel: '₹1,00,000+' },
    ],
    features: [
      { name: 'Building Profile', values: { basic: '1', compliance: '10', professional: '50', enterprise: '500' } },
      { name: 'Fire Equipment Database', values: { basic: true, compliance: true, professional: true, enterprise: true } },
      { name: 'Equipment Expiry Tracking', values: { basic: true, compliance: true, professional: true, enterprise: true } },
      { name: 'Fire NOC Details', values: { basic: true, compliance: true, professional: true, enterprise: true } },
      { name: 'Service History', values: { basic: true, compliance: true, professional: true, enterprise: true } },
      { name: 'AMC Records', values: { basic: true, compliance: true, professional: true, enterprise: true } },
      { name: 'Compliance Checklist', values: { basic: 'Basic', compliance: true, professional: 'Advanced', enterprise: 'Custom' } },
      { name: 'Compliance Due Alerts', values: { basic: true, compliance: true, professional: true, enterprise: true } },
      { name: 'Digital Document Storage', values: { basic: '100 Docs', compliance: '500 Docs', professional: 'Unlimited', enterprise: 'Unlimited' } },
      { name: 'Fire Service Reports', values: { basic: true, compliance: true, professional: true, enterprise: true } },
      { name: 'Fire Audit / Inspection Records', values: { basic: false, compliance: true, professional: true, enterprise: true } },
      { name: 'Building Compliance Score', values: { basic: false, compliance: true, professional: true, enterprise: true } },
      { name: 'Contractor Management', values: { basic: false, compliance: true, professional: true, enterprise: true } },
      { name: 'Fire Drill Management', values: { basic: false, compliance: false, professional: true, enterprise: true } },
      { name: 'Emergency Contact Directory', values: { basic: true, compliance: true, professional: true, enterprise: true } },
      { name: 'Management Dashboard', values: { basic: 'Basic', compliance: 'Standard', professional: 'Advanced', enterprise: 'Custom' } },
    ],
    faqs: [
      {
        question: 'What is Buzaao Premises?',
        answer:
          'Buzaao Premises is a digital fire-safety management solution for buildings, societies, hospitals, hotels, offices, factories, schools, malls and corporate premises.',
      },
      {
        question: 'Who can use Buzaao Premises?',
        answer:
          'Any building owner, facility manager, society management, property manager, administrator or corporate can use it to manage fire-safety records and compliance.',
      },
      {
        question: 'What can I manage through Buzaao Premises?',
        answer:
          'You can manage fire equipment, QR mapping, service history, AMC, Fire NOC details, compliance, inspection records, documents, reports and renewal reminders.',
      },
      {
        question: 'What is QR Mapping?',
        answer:
          'Each fire-safety equipment can be assigned a unique QR code. Scanning the QR can help identify the equipment, location, floor and service/inspection information.',
      },
      {
        question: 'How much does QR Mapping cost?',
        answer: 'Digital QR mapping is ₹25 per QR (see pricing table above).',
      },
      {
        question: 'What is included in the Digital QR Mapping price?',
        answer: 'It includes QR mapping, product-wise reporting and floor-wise reporting.',
      },
      {
        question: 'Do you provide QR stickers?',
        answer: 'Yes. Glow QR Stickers are available at ₹55 per QR, including product-wise and floor-wise reporting.',
      },
      {
        question: 'What is a Product-wise Report?',
        answer:
          'It provides equipment-level information such as equipment name, ID, location, floor, service history and current status.',
      },
      {
        question: 'What is a Floor-wise Report?',
        answer:
          'It provides a floor-by-floor view of equipment, quantity, service status, pending items and compliance status.',
      },
      {
        question: 'Can I track Fire NOC and compliance?',
        answer: 'Yes. You can maintain Fire NOC details, compliance requirements, documents and important due dates.',
      },
      {
        question: 'Can I track AMC and service history?',
        answer: 'Yes. AMC details, service records and inspection history can be maintained digitally.',
      },
      {
        question: 'Can I receive reminders for due services?',
        answer:
          'Yes. Buzaao can help you track equipment/service/compliance due dates and renewal activities.',
      },
      {
        question: 'Can my fire contractor access the premises information?',
        answer:
          'Yes, appropriate access can be provided to contractors/service providers so that service activities and reports can be managed digitally.',
      },
      {
        question: 'Can I manage multiple buildings?',
        answer:
          'Yes. Professional and Enterprise solutions can support multiple buildings and locations, depending on the selected package.',
      },
      {
        question: 'Can I store fire-safety documents digitally?',
        answer:
          'Yes. Important documents such as NOC, certificates, inspection reports, AMC documents and service reports can be organized digitally.',
      },
      {
        question: 'Can I generate a fire-safety compliance report?',
        answer:
          'Yes. Buzaao can generate digital reports based on the information and compliance data maintained in the system.',
      },
      {
        question: 'Can I add more users?',
        answer: 'Yes. Additional user access can be added as per the applicable plan.',
      },
      {
        question: 'Can Buzaao conduct a physical fire audit or survey?',
        answer:
          'Yes. Physical fire safety audits, surveys and mock drills can be provided as additional services, subject to location and scope.',
      },
      {
        question: 'Can I upgrade my Premises plan later?',
        answer: 'Yes. You can upgrade as your building or compliance-management requirements increase.',
      },
      {
        question: 'Is GST included in the displayed price?',
        answer:
          'Plan and service prices are generally shown as base prices. Applicable GST will be charged as per prevailing regulations.',
      },
    ],
  },
]

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
