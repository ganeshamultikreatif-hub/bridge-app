import type { MeetingRoomType } from "@/types/schedule";

export const MEETING_ROOM_TYPE_OPTIONS: {
  capacity: number;
  description: string;
  label: string;
  value: MeetingRoomType;
}[] = [
  {
    value: "large",
    label: "Besar",
    capacity: 12,
    description: "Kapasitas 12 orang",
  },
  {
    value: "medium",
    label: "Sedang",
    capacity: 6,
    description: "Kapasitas 6 orang",
  },
  {
    value: "smoking",
    label: "Smoking",
    capacity: 4,
    description: "Kapasitas 4 orang",
  },
];

export function getMeetingRoomTypeOption(value: MeetingRoomType | undefined) {
  if (!value) {
    return null;
  }

  return (
    MEETING_ROOM_TYPE_OPTIONS.find((option) => option.value === value) ?? null
  );
}

export function getMeetingRoomTypeLabel(
  value: MeetingRoomType | string | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const option = MEETING_ROOM_TYPE_OPTIONS.find((item) => item.value === value);
  return option ? `${option.label} (${option.capacity} Orang)` : value;
}
