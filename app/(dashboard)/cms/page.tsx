import { SuiteHandoff } from "@/components/shared/suite-handoff";
import { CMS_SYSTEM_LOGO_SRC, CMS_SYSTEM_URL } from "@/config/cms";

export default function CmsHandoffPage() {
  return (
    <SuiteHandoff
      title="CMS System"
      url={CMS_SYSTEM_URL}
      imageSrc={CMS_SYSTEM_LOGO_SRC}
      tone="cms"
    />
  );
}
