"use client";

import {
  sfArchiveboxFill,
  sfArrowLeft,
  sfArrowUpRight,
  sfBellFill,
  sfBellSlashFill,
  sfBold,
  sfBookFill,
  sfBriefcaseFill,
  sfBuilding2Fill,
  sfCalendar,
  sfCalendarBadgeCheckmark,
  sfChartBarFill,
  sfChartLineDowntrendXyaxis,
  sfChartLineUptrendXyaxis,
  sfCheckmark,
  sfCheckmarkCircleFill,
  sfChevronDown,
  sfChevronLeft,
  sfChevronRight,
  sfCircleDashed,
  sfCircleFill,
  sfClockFill,
  sfCreditcardFill,
  sfDesktopcomputer,
  sfDocumentFill,
  sfDocumentOnDocumentFill,
  sfDoorLeftHandOpen,
  sfEllipsis,
  sfExclamationmarkTriangleFill,
  sfEyeFill,
  sfEyeSlashFill,
  sfFilmFill,
  sfFlagFill,
  sfFolderFill,
  sfGear,
  sfGlobeFill,
  sfGraduationcapFill,
  sfHandsClapFill,
  sfHeartFill,
  sfInfoCircleFill,
  sfItalic,
  sfKeyFill,
  sfLightbulbFill,
  sfLine3Horizontal,
  sfLine3HorizontalDecrease,
  sfLink,
  sfListBullet,
  sfListBulletClipboard,
  sfLivephoto,
  sfMagnifyingglass,
  sfMegaphoneFill,
  sfMessageFill,
  sfMinus,
  sfMoonFill,
  sfNewspaperFill,
  sfPaintpaletteFill,
  sfPartyPopperFill,
  sfPencil,
  sfPerson2Fill,
  sfPerson3Fill,
  sfPersonCropCircleFill,
  sfPersonFillCheckmark,
  sfPhotoFill,
  sfPhotoOnRectangleAngledFill,
  sfPlayRectangleFill,
  sfPlus,
  sfReceiptFill,
  sfRectanglePortraitAndArrowRightFill,
  sfRectangleStackFill,
  sfShippingboxFill,
  sfSidebarLeft,
  sfSparkles,
  sfSquareAndArrowDownFill,
  sfSquareAndArrowUpFill,
  sfSquareGrid2x2Fill,
  sfSquareStack3dUpFill,
  sfStrikethrough,
  sfSunMaxFill,
  sfTablecellsFill,
  sfTagFill,
  sfTarget,
  sfTextAlignleft,
  sfTextPageFill,
  sfTrashFill,
  sfVideoFill,
  sfXmark,
} from "@bradleyhodges/sfsymbols";
import { SFIcon } from "@bradleyhodges/sfsymbols-react";
import type { IconDefinition } from "@bradleyhodges/sfsymbols-types";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { SF_ICON_SIZE } from "@/config/icons";
import { cn } from "@/lib/utils";

export type IconProps = Omit<
  ComponentPropsWithoutRef<typeof SFIcon>,
  "icon"
> & {
  className?: string;
};

export type Icon = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>;

/** @deprecated Prefer `Icon` — kept for sidebar/nav typing. */
export type AppIcon = Icon;

function createSFIcon(symbol: IconDefinition, displayName: string): Icon {
  const IconComponent = forwardRef<SVGSVGElement, IconProps>(
    function IconComponent({ className, size, ...props }, ref) {
      return (
        <SFIcon
          ref={ref}
          icon={symbol}
          size={size ?? SF_ICON_SIZE}
          className={cn("shrink-0", className)}
          {...props}
        />
      );
    },
  );

  IconComponent.displayName = displayName;
  return IconComponent;
}

/* ── SF Symbols (cms-aligned names) ─────────────────────────────── */

export const ArchiveIcon = createSFIcon(sfArchiveboxFill, "ArchiveIcon");
export const BellIcon = createSFIcon(sfBellFill, "BellIcon");
export const Building2Icon = createSFIcon(sfBuilding2Fill, "Building2Icon");
export const CalendarIcon = createSFIcon(sfCalendar, "CalendarIcon");
export const CaretDownIcon = createSFIcon(sfChevronDown, "CaretDownIcon");
export const CaretLeftIcon = createSFIcon(sfChevronLeft, "CaretLeftIcon");
export const CaretRightIcon = createSFIcon(sfChevronRight, "CaretRightIcon");
export const CheckIcon = createSFIcon(sfCheckmark, "CheckIcon");
export const ClockIcon = createSFIcon(sfClockFill, "ClockIcon");
export const DesktopIcon = createSFIcon(sfDesktopcomputer, "DesktopIcon");
export const DocumentIcon = createSFIcon(sfDocumentFill, "DocumentIcon");
export const DotsThreeIcon = createSFIcon(sfEllipsis, "DotsThreeIcon");
export const EyeIcon = createSFIcon(sfEyeFill, "EyeIcon");
export const EyeSlashIcon = createSFIcon(sfEyeSlashFill, "EyeSlashIcon");
export const FileTextIcon = createSFIcon(sfTextPageFill, "FileTextIcon");
export const FolderOpenIcon = createSFIcon(sfFolderFill, "FolderOpenIcon");
export const FunnelIcon = createSFIcon(sfLine3HorizontalDecrease, "FunnelIcon");
export const GearSixIcon = createSFIcon(sfGear, "GearSixIcon");
export const GlobeIcon = createSFIcon(sfGlobeFill, "GlobeIcon");
export const InfoIcon = createSFIcon(sfInfoCircleFill, "InfoIcon");
export const KeyIcon = createSFIcon(sfKeyFill, "KeyIcon");
export const ListIcon = createSFIcon(sfLine3Horizontal, "ListIcon");
export const ListBulletClipboardIcon = createSFIcon(
  sfListBulletClipboard,
  "ListBulletClipboardIcon",
);
export const LogoutIcon = createSFIcon(
  sfRectanglePortraitAndArrowRightFill,
  "LogoutIcon",
);
export const MagnifyingGlassIcon = createSFIcon(
  sfMagnifyingglass,
  "MagnifyingGlassIcon",
);
export const MessageIcon = createSFIcon(sfMessageFill, "MessageIcon");
export const MoonIcon = createSFIcon(sfMoonFill, "MoonIcon");
export const PaintpaletteIcon = createSFIcon(
  sfPaintpaletteFill,
  "PaintpaletteIcon",
);
export const PencilSimpleIcon = createSFIcon(sfPencil, "PencilSimpleIcon");
export const Person2Icon = createSFIcon(sfPerson2Fill, "Person2Icon");
export const PersonIcon = createSFIcon(sfPersonCropCircleFill, "PersonIcon");
export const PhotoIcon = createSFIcon(sfPhotoFill, "PhotoIcon");
export const PlusIcon = createSFIcon(sfPlus, "PlusIcon");
export const SidebarIcon = createSFIcon(sfSidebarLeft, "SidebarIcon");
export const SparkleIcon = createSFIcon(sfSparkles, "SparkleIcon");
export const SquaresFourIcon = createSFIcon(
  sfSquareGrid2x2Fill,
  "SquaresFourIcon",
);
export const SunIcon = createSFIcon(sfSunMaxFill, "SunIcon");
export const TagIcon = createSFIcon(sfTagFill, "TagIcon");
export const TargetIcon = createSFIcon(sfTarget, "TargetIcon");
export const TrashIcon = createSFIcon(sfTrashFill, "TrashIcon");
export const UploadSimpleIcon = createSFIcon(
  sfSquareAndArrowUpFill,
  "UploadSimpleIcon",
);
export const WarningIcon = createSFIcon(
  sfExclamationmarkTriangleFill,
  "WarningIcon",
);
export const XIcon = createSFIcon(sfXmark, "XIcon");

/* ── Scheduler aliases (keep existing import names working) ─────── */

export const AlertTriangle = WarningIcon;
export const AlignLeft = createSFIcon(sfTextAlignleft, "AlignLeft");
export const Archive = ArchiveIcon;
export const ArrowLeft = createSFIcon(sfArrowLeft, "ArrowLeft");
export const BarChart3 = createSFIcon(sfChartBarFill, "BarChart3");
export const Bell = BellIcon;
export const BellOff = createSFIcon(sfBellSlashFill, "BellOff");
export const Bold = createSFIcon(sfBold, "Bold");
export const BookOpen = createSFIcon(sfBookFill, "BookOpen");
/** Aggregate / “all brands” glyph — no Among Us SF Symbol. */
export const BrandAmongUs = Building2Icon;
export const Briefcase = createSFIcon(sfBriefcaseFill, "Briefcase");
export const Building2 = Building2Icon;
export const CalendarCheck = createSFIcon(
  sfCalendarBadgeCheckmark,
  "CalendarCheck",
);
export const CalendarDays = CalendarIcon;
export const CalendarFilled = CalendarIcon;
export const CalendarRange = CalendarIcon;
export const Check = CheckIcon;
export const CheckCircle2 = createSFIcon(sfCheckmarkCircleFill, "CheckCircle2");
export const ChevronDown = CaretDownIcon;
export const ChevronLeft = CaretLeftIcon;
export const ChevronRight = CaretRightIcon;
export const CircleDashed = createSFIcon(sfCircleDashed, "CircleDashed");
export const CircleDot = createSFIcon(sfCircleFill, "CircleDot");
export const Clock = ClockIcon;
export const Clock3 = ClockIcon;
export const Copy = createSFIcon(sfDocumentOnDocumentFill, "Copy");
export const CreditCard = createSFIcon(sfCreditcardFill, "CreditCard");
export const Download = createSFIcon(sfSquareAndArrowDownFill, "Download");
export const DoorOpen = createSFIcon(sfDoorLeftHandOpen, "DoorOpen");
export const ExternalLink = createSFIcon(sfArrowUpRight, "ExternalLink");
export const Eye = EyeIcon;
export const EyeOff = EyeSlashIcon;
export const FileText = FileTextIcon;
export const Flag = createSFIcon(sfFlagFill, "Flag");
export const Globe = GlobeIcon;
export const GraphFilled = BarChart3;
export const GraduationCap = createSFIcon(sfGraduationcapFill, "GraduationCap");
export const HandsClap = createSFIcon(sfHandsClapFill, "HandsClap");
export const Heart = createSFIcon(sfHeartFill, "Heart");
export const Image = PhotoIcon;
export const Images = createSFIcon(sfPhotoOnRectangleAngledFill, "Images");
export const Info = InfoIcon;
export const Italic = createSFIcon(sfItalic, "Italic");
export const Layers = createSFIcon(sfSquareStack3dUpFill, "Layers");
export const LayoutGrid = SquaresFourIcon;
export const LayoutGridFilled = SquaresFourIcon;
export const Lightbulb = createSFIcon(sfLightbulbFill, "Lightbulb");
export const Link2 = createSFIcon(sfLink, "Link2");
export const List = createSFIcon(sfListBullet, "List");
export const LivePhoto = createSFIcon(sfLivephoto, "LivePhoto");
export const LivePhotoFilled = LivePhoto;
export const LogOut = LogoutIcon;
export const Megaphone = createSFIcon(sfMegaphoneFill, "Megaphone");
export const Menu = ListIcon;
export const MenuFilled = createSFIcon(sfRectangleStackFill, "MenuFilled");
export const MessageCircle = MessageIcon;
export const MessageSquareText = MessageIcon;
export const Minus = createSFIcon(sfMinus, "Minus");
export const Monitor = DesktopIcon;
export const Moon = MoonIcon;
export const MoreHorizontal = DotsThreeIcon;
export const MoreVertical = DotsThreeIcon;
export const Newspaper = createSFIcon(sfNewspaperFill, "Newspaper");
export const Package = createSFIcon(sfShippingboxFill, "Package");
export const PackageCheck = CheckCircle2;
export const Palette = PaintpaletteIcon;
export const PartyPopper = createSFIcon(sfPartyPopperFill, "PartyPopper");
export const Pencil = PencilSimpleIcon;
export const Plus = PlusIcon;
export const Presentation = createSFIcon(sfPlayRectangleFill, "Presentation");
export const Receipt = createSFIcon(sfReceiptFill, "Receipt");
export const Search = MagnifyingGlassIcon;
export const Settings = GearSixIcon;
export const Share2 = createSFIcon(sfSquareAndArrowUpFill, "Share2");
export const Sparkles = SparkleIcon;
export const Strikethrough = createSFIcon(sfStrikethrough, "Strikethrough");
export const Sun = SunIcon;
export const Table2 = createSFIcon(sfTablecellsFill, "Table2");
export const Tag = TagIcon;
export const Target = TargetIcon;
export const Trash2 = TrashIcon;
export const TrendingDown = createSFIcon(
  sfChartLineDowntrendXyaxis,
  "TrendingDown",
);
export const TrendingUp = createSFIcon(sfChartLineUptrendXyaxis, "TrendingUp");
export const Upload = UploadSimpleIcon;
export const UserCheck = createSFIcon(sfPersonFillCheckmark, "UserCheck");
export const UserCircle = PersonIcon;
export const UserRound = PersonIcon;
export const Users = createSFIcon(sfPerson3Fill, "Users");
export const Video = createSFIcon(sfVideoFill, "Video");
export const X = XIcon;
