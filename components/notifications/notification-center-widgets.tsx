import { NotificationWidgetCalendar } from "@/components/notifications/notification-widget-calendar";
import { NotificationWidgetClock } from "@/components/notifications/notification-widget-clock";
import { NotificationWidgetWeather } from "@/components/notifications/notification-widget-weather";

export function NotificationCenterWidgets() {
  return (
    <section aria-label="Widgets" className="grid shrink-0 grid-cols-2 gap-2.5">
      <NotificationWidgetClock />
      <NotificationWidgetWeather />
      <NotificationWidgetCalendar />
    </section>
  );
}
