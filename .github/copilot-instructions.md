# TecBunny Solutions - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
TecBunny Solutions is a comprehensive CRM & E-commerce platform built with Next.js, TypeScript, and Tailwind CSS. The platform serves retail & wholesale businesses specializing in computer electronics, CCTV parts, computers & laptops, networking equipment, mobile accessories, and general electronics accessories.

## Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL, Auth, API, Realtime)
- **Media Management**: Cloudinary (Image/video upload & optimization)
- **Payment Gateway**: PhonePe (UPI, Credit/Debit Cards, Wallets)
- **Hosting**: Vercel

## Architecture
The platform follows a multi-role architecture with three main interfaces:

### 1. Customer Interface
- User registration & login with email/mobile/OTP verification
- Address book management
- E-commerce flow (browse, cart, checkout)
- Service requests (repair services)
- Order management & tracking

### 2. Vendor Interface
- Vendor registration with admin approval
- Product management with Cloudinary integration
- Inventory & pricing control
- Order & sales reports

### 3. Admin Interface
- Website content management
- User & vendor management
- Product & category control
- Payment tracking via PhonePe
- Analytics & reporting

## Code Guidelines
- Use TypeScript for all components and utilities
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling with custom design system
- Implement proper error handling and loading states
- Use Supabase client for database operations
- Follow security best practices for authentication
- Implement responsive design for mobile compatibility

## File Structure
- `/src/app` - Next.js App Router pages
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and configurations
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks
- `/src/contexts` - React context providers
- `/src/utils` - Helper functions

## Integration Requirements
- Supabase integration for backend services
- Cloudinary SDK for media management
- PhonePe payment gateway integration
- Real-time features using Supabase Realtime
- Push notifications setup
- SEO optimization for e-commerce
