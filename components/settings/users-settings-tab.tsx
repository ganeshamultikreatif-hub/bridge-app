"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FormSectionHeading } from "@/components/shared/form-section-heading";
import { HeaderActions } from "@/components/shared/header-actions";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HEADER_TOOLBAR_BUTTON } from "@/config/header-toolbar";
import { ORG_ROLE_LABELS, ORG_ROLES, type OrgRole } from "@/config/org-roles";
import {
  SETTINGS_CONTROL_STACK,
  SETTINGS_FIELD,
  SETTINGS_FIELD_LABEL,
  SETTINGS_GROUP,
  SETTINGS_ROW,
} from "@/config/settings-layout";
import { Plus, Users } from "@/lib/icons";
import {
  listOrgUsers,
  listSettingsDepartments,
  removeOrgUser,
  upsertOrgUser,
} from "@/lib/settings/data";
import { cn } from "@/lib/utils";
import type { OrgUser, OrgUserStatus } from "@/types/settings";

const STATUS_LABEL: Record<OrgUserStatus, string> = {
  active: "Active",
  invited: "Invited",
  disabled: "Disabled",
};

function emptyDraft(departmentId: string): OrgUser {
  return {
    id: `u_${Date.now()}`,
    name: "",
    email: "",
    role: "sales",
    departmentId,
    status: "invited",
  };
}

export function UsersSettingsTab() {
  const departments = useMemo(() => listSettingsDepartments(), []);
  const [users, setUsers] = useState(() => listOrgUsers());
  const [roleFilter, setRoleFilter] = useState<OrgRole | "all">("all");
  const [draft, setDraft] = useState<OrgUser | null>(null);

  const filtered = useMemo(
    () =>
      users.filter((user) =>
        roleFilter === "all" ? true : user.role === roleFilter,
      ),
    [users, roleFilter],
  );

  function refresh() {
    setUsers(listOrgUsers());
  }

  function openAdd() {
    setDraft(emptyDraft(departments[0]?.id ?? "sales"));
  }

  function saveDraft() {
    if (!draft) return;
    if (!draft.name.trim() || !draft.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    upsertOrgUser({
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
    });
    setDraft(null);
    refresh();
    toast.success("User saved");
  }

  function handleDisable(user: OrgUser) {
    upsertOrgUser({
      ...user,
      status: user.status === "disabled" ? "active" : "disabled",
    });
    refresh();
    toast.message(
      user.status === "disabled" ? "User re-enabled" : "User disabled",
      { description: user.name },
    );
  }

  function handleRemove(user: OrgUser) {
    removeOrgUser(user.id);
    refresh();
    toast.success("User removed", { description: user.email });
  }

  const addButton = (
    <Button
      type="button"
      className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
      onClick={openAdd}
    >
      <Plus data-icon="inline-start" />
      Add user
    </Button>
  );

  return (
    <>
      <HeaderActions>{addButton}</HeaderActions>

      <div className="space-y-4">
        <SolidSurface className="space-y-4 p-4 sm:p-5">
          <FormSectionHeading
            icon={<Users className="size-4" />}
            title="User management"
            description="Admin, Manager, Sales, and Marketing accounts for this workspace."
          />

          <div className="flex flex-wrap gap-1 rounded-full bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => setRoleFilter("all")}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                roleFilter === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              All
            </button>
            {ORG_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                  roleFilter === role
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {ORG_ROLE_LABELS[role]}
              </button>
            ))}
          </div>
        </SolidSurface>

        {draft ? (
          <SolidSurface className="space-y-4 p-4 sm:p-5">
            <FormSectionHeading
              title={
                users.some((u) => u.id === draft.id)
                  ? "Edit user"
                  : "Invite user"
              }
              description="Assign a role and department."
            />
            <div className={SETTINGS_CONTROL_STACK}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className={SETTINGS_FIELD}>
                  <Label className={SETTINGS_FIELD_LABEL}>Name</Label>
                  <Input
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                  />
                </div>
                <div className={SETTINGS_FIELD}>
                  <Label className={SETTINGS_FIELD_LABEL}>Email</Label>
                  <Input
                    type="email"
                    value={draft.email}
                    onChange={(e) =>
                      setDraft({ ...draft, email: e.target.value })
                    }
                  />
                </div>
                <div className={SETTINGS_FIELD}>
                  <Label className={SETTINGS_FIELD_LABEL}>Role</Label>
                  <Select
                    value={draft.role}
                    onValueChange={(value) =>
                      setDraft({ ...draft, role: value as OrgRole })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORG_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ORG_ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className={SETTINGS_FIELD}>
                  <Label className={SETTINGS_FIELD_LABEL}>Department</Label>
                  <Select
                    value={draft.departmentId}
                    onValueChange={(value) =>
                      setDraft({ ...draft, departmentId: value ?? "sales" })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDraft(null)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={saveDraft}>
                  Save user
                </Button>
              </div>
            </div>
          </SolidSurface>
        ) : null}

        <div className={SETTINGS_GROUP}>
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No users in this filter.
            </p>
          ) : (
            filtered.map((user) => {
              const dept = departments.find((d) => d.id === user.departmentId);
              return (
                <div
                  key={user.id}
                  className={cn(
                    SETTINGS_ROW,
                    "flex-wrap justify-between gap-3 border-b border-border/40 last:border-0",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      <Badge variant="secondary">
                        {ORG_ROLE_LABELS[user.role]}
                      </Badge>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "outline"
                        }
                      >
                        {STATUS_LABEL[user.status]}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {user.email} · {dept?.name ?? "—"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setDraft({ ...user })}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDisable(user)}
                    >
                      {user.status === "disabled" ? "Enable" : "Disable"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(user)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
