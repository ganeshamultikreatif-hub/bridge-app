"use client";

import { useEffect, useState } from "react";
import { CompanySettingsTab } from "@/components/settings/company-settings-tab";
import { DepartmentsSettingsTab } from "@/components/settings/departments-settings-tab";
import { RolesSettingsTab } from "@/components/settings/roles-settings-tab";
import { UsersSettingsTab } from "@/components/settings/users-settings-tab";
import { WhatsAppSettingsTab } from "@/components/settings/whatsapp-settings-tab";
import { FixedPageTabs } from "@/components/shared/fixed-page-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildSettingsTabBreadcrumbs } from "@/config/breadcrumbs";
import {
  DEFAULT_SETTINGS_TAB,
  SETTINGS_TAB_META,
  SETTINGS_TABS,
  type SettingsTabId,
} from "@/config/settings-tabs";
import { useBreadcrumbContext } from "@/contexts/breadcrumb-context";
import { getCompanySettings, getWhatsAppSettings } from "@/lib/settings/data";

function isSettingsTab(value: string): value is SettingsTabId {
  return (SETTINGS_TABS as readonly string[]).includes(value);
}

export function SettingsView() {
  const { setTrail } = useBreadcrumbContext();
  const [tab, setTab] = useState<SettingsTabId>(DEFAULT_SETTINGS_TAB);
  const [company] = useState(() => getCompanySettings());
  const [whatsapp] = useState(() => getWhatsAppSettings());

  useEffect(() => {
    setTrail(buildSettingsTabBreadcrumbs(tab));
    return () => setTrail(null);
  }, [setTrail, tab]);

  return (
    <div className="min-w-0 space-y-4 md:space-y-6">
      <Tabs
        value={tab}
        onValueChange={(next) => {
          if (isSettingsTab(next)) setTab(next);
        }}
      >
        <FixedPageTabs>
          <TabsList aria-label="Settings sections" className="flex w-full">
            {SETTINGS_TABS.map((id) => (
              <TabsTrigger key={id} value={id} className="min-w-0 flex-1">
                <span className="truncate sm:hidden">
                  {SETTINGS_TAB_META[id].shortLabel}
                </span>
                <span className="hidden truncate sm:inline">
                  {SETTINGS_TAB_META[id].title}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </FixedPageTabs>

        <TabsContent value="company" className="mt-0">
          <CompanySettingsTab initial={company} />
        </TabsContent>
        <TabsContent value="whatsapp" className="mt-0">
          <WhatsAppSettingsTab initial={whatsapp} />
        </TabsContent>
        <TabsContent value="departments" className="mt-0">
          <DepartmentsSettingsTab />
        </TabsContent>
        <TabsContent value="users" className="mt-0">
          <UsersSettingsTab />
        </TabsContent>
        <TabsContent value="roles" className="mt-0">
          <RolesSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
