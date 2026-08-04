import { SuiteHandoff } from "@/components/shared/suite-handoff";
import {
  SCHEDULER_APP_LOGO_SRC,
  SCHEDULER_APP_URL,
} from "@/config/scheduler-suite";

export default function SchedulerHandoffPage() {
  return (
    <SuiteHandoff
      title="Scheduler"
      url={SCHEDULER_APP_URL}
      imageSrc={SCHEDULER_APP_LOGO_SRC}
      imageMask
      tone="scheduler"
    />
  );
}
