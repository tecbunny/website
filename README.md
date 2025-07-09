<<<<<<< HEAD
# website
=======
# TecBunny Solutions - CRM & E-commerce Platform

A comprehensive CRM and e-commerce platform built with Next.js for retail & wholesale of computer electronics, CCTV parts, networking equipment, and mobile accessories.

## 🚀 Features

### Multi-Role Architecture
- **Customer Interface**: User registration, shopping cart, order tracking, service requests
- **Vendor Interface**: Product management, inventory control, sales analytics
- **Admin Interface**: Platform management, user control, payment tracking

### Core Functionalities
- **E-commerce**: Product catalog, shopping cart, checkout, order management
- **CRM**: Customer relationship management, vendor onboarding, service requests
- **Payments**: PhonePe integration (UPI, Cards, Wallets)
- **Media**: Cloudinary integration for image/video management
- **Authentication**: Secure login with email/mobile/OTP verification
- **Real-time**: Live chat support, push notifications

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, API, Realtime)
- **Media**: Cloudinary
- **Payments**: PhonePe Gateway
- **Hosting**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/tecbunny-solutions.git
cd tecbunny-solutions
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables:
- Supabase credentials
- Cloudinary configuration
- PhonePe payment gateway settings
- NextAuth configuration

## 🔧 Configuration

### Supabase Setup
1. Create a new project at [Supabase](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Run the database migrations (SQL files provided)

### Cloudinary Setup
1. Create account at [Cloudinary](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Add to `.env.local`

### PhonePe Integration
1. Register for PhonePe merchant account
2. Get merchant ID, key, and user ID
3. Configure webhook URLs for payment callbacks

## 🚀 Getting Started

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── ...
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
└── utils/              # Helper functions
```

## 🔐 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# PhonePe
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_MERCHANT_KEY=your_merchant_key
PHONEPE_ENVIRONMENT=sandbox

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
```

## 🎯 Business Categories

- Computer Electronics
- CCTV Parts & Systems
- Computers & Laptops
- Networking Equipment
- Mobile Accessories
- General Electronics Accessories

## 🔄 Workflows

### Customer Journey
1. Registration/Login
2. Browse products/categories
3. Add to cart
4. Checkout with PhonePe
5. Order tracking
6. Service requests

### Vendor Journey
1. Registration & approval
2. Product listing
3. Inventory management
4. Order fulfillment
5. Sales analytics

### Admin Operations
1. User & vendor management
2. Product & category control
3. Payment monitoring
4. Content management
5. Analytics & reporting

## 📱 Mobile Support

- Responsive design for all devices
- Mobile-first approach
- Touch-friendly interfaces
- Mobile payment optimization

## 🔒 Security Features

- Secure authentication
- Payment encryption
- Data protection
- Role-based access control
- Input validation & sanitization

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Analytics & Reporting

- Sales dashboards
- Customer analytics
- Vendor performance
- Payment tracking
- Inventory reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

- Email: support@tecbunny.com
- Phone: +91 9876543210
- Documentation: [docs.tecbunny.com](https://docs.tecbunny.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for backend services
- Cloudinary for media management
- PhonePe for payment integration
- Vercel for hosting platform
>>>>>>> 2e31ebe (Initial project upload)
