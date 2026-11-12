import React from 'react';
import {
  Smartphone,
  Wallet,
  FileText,
  Key,
  ShoppingBag,
  Briefcase,
  Laptop,
  Gem,
  Watch,
  Glasses,
  Headphones,
  Car,
  HeartHandshake,
  Users,
  Package,
  Search,
  Filter,
  Plus,
  Bell,
  MessageSquare,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  Sun,
  Moon,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Bookmark,
  Share2,
  Trash2,
  Edit,
  Eye,
  Check,
  Award,
  HelpCircle,
  Settings,
  LogOut,
  User,
  LayoutDashboard,
  Compass,
  FileCheck,
  Send,
  Flag,
  Phone,
  Mail,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const iconProps = { className, size };

  switch (name) {
    case 'Smartphone':
      return <Smartphone {...iconProps} />;
    case 'Wallet':
      return <Wallet {...iconProps} />;
    case 'FileText':
      return <FileText {...iconProps} />;
    case 'Key':
      return <Key {...iconProps} />;
    case 'ShoppingBag':
      return <ShoppingBag {...iconProps} />;
    case 'Briefcase':
      return <Briefcase {...iconProps} />;
    case 'Laptop':
      return <Laptop {...iconProps} />;
    case 'Gem':
      return <Gem {...iconProps} />;
    case 'Watch':
      return <Watch {...iconProps} />;
    case 'Glasses':
      return <Glasses {...iconProps} />;
    case 'Headphones':
      return <Headphones {...iconProps} />;
    case 'Car':
      return <Car {...iconProps} />;
    case 'HeartHandshake':
      return <HeartHandshake {...iconProps} />;
    case 'Users':
      return <Users {...iconProps} />;
    case 'Package':
      return <Package {...iconProps} />;
    case 'Search':
      return <Search {...iconProps} />;
    case 'Filter':
      return <Filter {...iconProps} />;
    case 'Plus':
      return <Plus {...iconProps} />;
    case 'Bell':
      return <Bell {...iconProps} />;
    case 'MessageSquare':
      return <MessageSquare {...iconProps} />;
    case 'Shield':
      return <Shield {...iconProps} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...iconProps} />;
    case 'AlertCircle':
      return <AlertCircle {...iconProps} />;
    case 'Clock':
      return <Clock {...iconProps} />;
    case 'MapPin':
      return <MapPin {...iconProps} />;
    case 'ChevronRight':
      return <ChevronRight {...iconProps} />;
    case 'ChevronLeft':
      return <ChevronLeft {...iconProps} />;
    case 'X':
      return <X {...iconProps} />;
    case 'Menu':
      return <Menu {...iconProps} />;
    case 'Sun':
      return <Sun {...iconProps} />;
    case 'Moon':
      return <Moon {...iconProps} />;
    case 'Sparkles':
      return <Sparkles {...iconProps} />;
    case 'ArrowUpRight':
      return <ArrowUpRight {...iconProps} />;
    case 'ArrowRight':
      return <ArrowRight {...iconProps} />;
    case 'Bookmark':
      return <Bookmark {...iconProps} />;
    case 'Share2':
      return <Share2 {...iconProps} />;
    case 'Trash2':
      return <Trash2 {...iconProps} />;
    case 'Edit':
      return <Edit {...iconProps} />;
    case 'Eye':
      return <Eye {...iconProps} />;
    case 'Check':
      return <Check {...iconProps} />;
    case 'Award':
      return <Award {...iconProps} />;
    case 'HelpCircle':
      return <HelpCircle {...iconProps} />;
    case 'Settings':
      return <Settings {...iconProps} />;
    case 'LogOut':
      return <LogOut {...iconProps} />;
    case 'User':
      return <User {...iconProps} />;
    case 'LayoutDashboard':
      return <LayoutDashboard {...iconProps} />;
    case 'Compass':
      return <Compass {...iconProps} />;
    case 'FileCheck':
      return <FileCheck {...iconProps} />;
    case 'Send':
      return <Send {...iconProps} />;
    case 'Flag':
      return <Flag {...iconProps} />;
    case 'Phone':
      return <Phone {...iconProps} />;
    case 'Mail':
      return <Mail {...iconProps} />;
    case 'Lock':
      return <Lock {...iconProps} />;
    case 'ExternalLink':
      return <ExternalLink {...iconProps} />;
    default:
      return <Package {...iconProps} />;
  }
};
