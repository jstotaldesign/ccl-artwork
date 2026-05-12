"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Users, CreditCard } from "lucide-react";
import { Btn, Card, Field, Input, Textarea } from "@/components/ui";
import { Checkbox } from "@/components/ui/Checkbox";
import { DatePicker } from "@/components/ui/DatePicker";
import { toast } from "@/lib/toast";
import { FileUpload } from "@/components/ui/FileUpload";
import { Slider } from "@/components/ui/Slider";
import { Stat } from "@/components/ui/Stat";

type YesNo = "" | "no" | "yes";

interface FormState {
  documentNo: string;
  customer: string;
  customerDocRef: string;
  informedDate: Date | null;
  contactPerson: string;
  customerService: string;
  artworkNo: string;
  gcasNo: string;
  description: string;
  remark: string;

  salesVerify: boolean;
  salesBlockNav: boolean;
  salesInformDept: boolean;
  salesSignedBy: string;
  salesSignedDate: Date | null;
  approvedBy: string;

  whHasFgStock: YesNo;
  whInformedBy: string;
  whFgHandling: string;
  whSignedBy: string;
  whSignedDate: Date | null;

  prodHasInProgress: YesNo;
  prodSignedBy: string;
  prodSignedDate: Date | null;

  techAcknowledged: boolean;
  techSignedBy: string;
  techSignedDate: Date | null;

  graphicUpdateAwStatus: boolean;
  graphicSignedBy: string;
  graphicSignedDate: Date | null;

  shopfloorSeparate: boolean;
  shopfloorDestroyed: boolean;
  shopfloorDestroyDate: Date | null;
  shopfloorSignedBy: string;
  shopfloorSignedDate: Date | null;

  qaHasReleaseWaiting: YesNo;
  qaSeparatePss: boolean;
  qaCancelColorLog: boolean;
  qaSignedBy: string;
  qaSignedDate: Date | null;

  csVerifyAllAck: boolean;
  csFinalSignedBy: string;
  csFinalSignedDate: Date | null;
}

const initial: FormState = {
  documentNo: "",
  customer: "",
  customerDocRef: "",
  informedDate: null,
  contactPerson: "",
  customerService: "",
  artworkNo: "",
  gcasNo: "",
  description: "",
  remark: "",
  salesVerify: false,
  salesBlockNav: false,
  salesInformDept: false,
  salesSignedBy: "",
  salesSignedDate: null,
  approvedBy: "",
  whHasFgStock: "",
  whInformedBy: "",
  whFgHandling: "",
  whSignedBy: "",
  whSignedDate: null,
  prodHasInProgress: "",
  prodSignedBy: "",
  prodSignedDate: null,
  techAcknowledged: false,
  techSignedBy: "",
  techSignedDate: null,
  graphicUpdateAwStatus: false,
  graphicSignedBy: "",
  graphicSignedDate: null,
  shopfloorSeparate: false,
  shopfloorDestroyed: false,
  shopfloorDestroyDate: null,
  shopfloorSignedBy: "",
  shopfloorSignedDate: null,
  qaHasReleaseWaiting: "",
  qaSeparatePss: false,
  qaCancelColorLog: false,
  qaSignedBy: "",
  qaSignedDate: null,
  csVerifyAllAck: false,
  csFinalSignedBy: "",
  csFinalSignedDate: null,
};

interface Props {
  recordId?: string;
  initialState?: Partial<FormState>;
}

export function ArtworkDiscontinueForm({ recordId, initialState }: Props = {}) {
  const router = useRouter();
  const [s, setS] = useState<FormState>({ ...initial, ...initialState });
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [vol, setVol] = useState(0);
  const isEdit = Boolean(recordId);

  function patch<K extends keyof FormState>(k: K, v: FormState[K]) {
    setS((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!s.customer.trim()) {
      toast.error("customer_required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...s,
        informedDate: s.informedDate?.toISOString() ?? null,
        salesSignedDate: s.salesSignedDate?.toISOString() ?? null,
        whSignedDate: s.whSignedDate?.toISOString() ?? null,
        prodSignedDate: s.prodSignedDate?.toISOString() ?? null,
        techSignedDate: s.techSignedDate?.toISOString() ?? null,
        graphicSignedDate: s.graphicSignedDate?.toISOString() ?? null,
        shopfloorDestroyDate: s.shopfloorDestroyDate?.toISOString() ?? null,
        shopfloorSignedDate: s.shopfloorSignedDate?.toISOString() ?? null,
        qaSignedDate: s.qaSignedDate?.toISOString() ?? null,
        csFinalSignedDate: s.csFinalSignedDate?.toISOString() ?? null,
        whHasFgStock: s.whHasFgStock || null,
        prodHasInProgress: s.prodHasInProgress || null,
        qaHasReleaseWaiting: s.qaHasReleaseWaiting || null,
      };
      const url = isEdit ? `/api/artwork-discontinue/${recordId}` : "/api/artwork-discontinue";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error?.code ?? (isEdit ? "update_failed" : "create_failed"));
        return;
      }
      toast.success(isEdit ? "Form updated" : "Form saved");
      router.push(isEdit ? `/artwork-discontinue/${recordId}` : "/artwork-discontinue");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ─── Header ────────────────────────────────────────────────── */}
      <Card>
        <h2 className="font-bold mb-4">Document header</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Document No.">
            <Input value={s.documentNo} onChange={(e) => patch("documentNo", e.target.value)} />
          </Field>
          <Field label="Customer" required>
            <Input
              value={s.customer}
              onChange={(e) => patch("customer", e.target.value)}
              placeholder="CXXX"
              required
            />
          </Field>
          <Stat label="MRR" value="$12,480" delta={{ value: "+18%", up: true }} icon={CreditCard} tone="brand" />
<Stat label="Users" value="2,481" delta={{ value: "+9%", up: true }} icon={Users} tone="info" />
          <Field label="Customer Document Ref. #">
            <Input value={s.customerDocRef} onChange={(e) => patch("customerDocRef", e.target.value)} />
          </Field>
          <Field label="Informed Date (วันที่แจ้ง)">
            <DatePicker value={s.informedDate} onChange={(d) => patch("informedDate", d)} />
          </Field>
          <Field label="Contact Person">
            <Input value={s.contactPerson} onChange={(e) => patch("contactPerson", e.target.value)} />
          </Field>
          <Field label="Customer Service">
            <Input value={s.customerService} onChange={(e) => patch("customerService", e.target.value)} />
          </Field>
          <Field label="Artwork No.">
            <Input value={s.artworkNo} onChange={(e) => patch("artworkNo", e.target.value)} />
          </Field>
          <Slider value={vol} onChange={setVol} min={0} max={100} marks={[0, 25, 50, 75, 100]} showValue />
          <Field label="GCAS No.">
            <Input value={s.gcasNo} onChange={(e) => patch("gcasNo", e.target.value)} />
          </Field>
          <Field label="Description" className="md:col-span-2">
            <Textarea value={s.description} onChange={(e) => patch("description", e.target.value)} rows={2} />
          </Field>
          <Field label="Remark" className="md:col-span-2">
            <Textarea value={s.remark} onChange={(e) => patch("remark", e.target.value)} rows={2} />
          </Field>
          <DatePicker value={date} onChange={setDate} />
          <FileUpload
            value={files}
            onChange={setFiles}
            multiple
            maxSize={5 * 1024 * 1024}
            hint="PDF, PNG, JPG up to 5MB"
          />
        </div>
      </Card>

      {/* ─── 1. Sales & CS Action (top) ─────────────────────────────── */}
      <SectionCard
        index={1}
        title="Sales & CS Action"
        signLabel="Sales"
        signedBy={s.salesSignedBy}
        signedDate={s.salesSignedDate}
        onSignedBy={(v) => patch("salesSignedBy", v)}
        onSignedDate={(d) => patch("salesSignedDate", d)}
        extra={
          <Field label="Approve by (อนุมัติโดย)">
            <Input value={s.approvedBy} onChange={(e) => patch("approvedBy", e.target.value)} />
          </Field>
        }
      >
        <Checkbox
          label="Verify the item that customer informed to Cancelled or Discontinue A/W (ตรวจสอบการยกเลิก)"
          checked={s.salesVerify}
          onChange={(e) => patch("salesVerify", e.target.checked)}
        />
        <Checkbox
          label="Block item in NAV (ยกเลิกรายการในระบบ NAV)"
          checked={s.salesBlockNav}
          onChange={(e) => patch("salesBlockNav", e.target.checked)}
        />
        <Checkbox
          label="Inform this note to related department (แจ้งผู้เกี่ยวข้องรับทราบ)"
          checked={s.salesInformDept}
          onChange={(e) => patch("salesInformDept", e.target.checked)}
        />
      </SectionCard>

      {/* ─── 2. WH Action ──────────────────────────────────────────── */}
      <SectionCard
        index={2}
        title="WH Action"
        signLabel="Warehouse"
        signedBy={s.whSignedBy}
        signedDate={s.whSignedDate}
        onSignedBy={(v) => patch("whSignedBy", v)}
        onSignedDate={(d) => patch("whSignedDate", d)}
      >
        <p className="text-sm">
          Check FG in stock which are the cancelled item, then inform the Planner
          <span className="block text-xs text-[var(--muted-fg)] mt-0.5">
            ตรวจสอบว่ามี stock ของ FG ที่เป็นไอเทมที่ยกเลิกหรือไม่ แล้วแจ้งกลับ CS
          </span>
        </p>
        <YesNoRow
          value={s.whHasFgStock}
          onChange={(v) => patch("whHasFgStock", v)}
          noLabel="No (ไม่มีไอเทมยกเลิกที่เป็น FG)"
          yesLabel="Yes (มีไอเทมยกเลิกที่เป็น FG)"
        />
        {s.whHasFgStock === "yes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7">
            <Field label="ทำการแจ้ง CS/Sale by…">
              <Input value={s.whInformedBy} onChange={(e) => patch("whInformedBy", e.target.value)} />
            </Field>
            <Field label="การจัดการ FG">
              <Input value={s.whFgHandling} onChange={(e) => patch("whFgHandling", e.target.value)} />
            </Field>
          </div>
        )}
      </SectionCard>

      {/* ─── 3. Production Action ──────────────────────────────────── */}
      <SectionCard
        index={3}
        title="Production Action"
        signLabel="Production"
        signedBy={s.prodSignedBy}
        signedDate={s.prodSignedDate}
        onSignedBy={(v) => patch("prodSignedBy", v)}
        onSignedDate={(d) => patch("prodSignedDate", d)}
      >
        <p className="text-sm">
          Check the cancelled item has any jobs currently in production
          <span className="block text-xs text-[var(--muted-fg)] mt-0.5">
            ตรวจสอบไอเทมที่ยกเลิกว่ามีงานที่อยู่ในระหว่างการผลิตหรือไม่
          </span>
        </p>
        <YesNoRow
          value={s.prodHasInProgress}
          onChange={(v) => patch("prodHasInProgress", v)}
          noLabel="No (ไม่มีไอเทมยกเลิกที่อยู่ระหว่างการผลิต)"
          yesLabel="Yes (มีไอเทมยกเลิกที่อยู่ระหว่างการผลิต) — แจ้ง Planning เพื่อเอาออกจากแผนผลิต"
        />
      </SectionCard>

      {/* ─── 4. Technical Action ───────────────────────────────────── */}
      <SectionCard
        index={4}
        title="Technical Action"
        signLabel="Technical"
        signedBy={s.techSignedBy}
        signedDate={s.techSignedDate}
        onSignedBy={(v) => patch("techSignedBy", v)}
        onSignedDate={(d) => patch("techSignedDate", d)}
      >
        <Checkbox
          label="รับทราบการยกเลิก item"
          checked={s.techAcknowledged}
          onChange={(e) => patch("techAcknowledged", e.target.checked)}
        />
      </SectionCard>

      {/* ─── 5. Graphic Action ─────────────────────────────────────── */}
      <SectionCard
        index={5}
        title="Graphic Action"
        signLabel="Graphic"
        signedBy={s.graphicSignedBy}
        signedDate={s.graphicSignedDate}
        onSignedBy={(v) => patch("graphicSignedBy", v)}
        onSignedDate={(d) => patch("graphicSignedDate", d)}
      >
        <Checkbox
          label="Job Specification: update AW Status เป็น Discontinue / Hold / Cancel"
          checked={s.graphicUpdateAwStatus}
          onChange={(e) => patch("graphicUpdateAwStatus", e.target.checked)}
        />
      </SectionCard>

      {/* ─── 6. Shopfloor Action ───────────────────────────────────── */}
      <SectionCard
        index={6}
        title="Shopfloor Action"
        signLabel="Graphic"
        signedBy={s.shopfloorSignedBy}
        signedDate={s.shopfloorSignedDate}
        onSignedBy={(v) => patch("shopfloorSignedBy", v)}
        onSignedDate={(d) => patch("shopfloorSignedDate", d)}
      >
        <Checkbox
          label="แยกเล่ม artwork ออกจากที่จัดเก็บเพื่อทำลาย"
          checked={s.shopfloorSeparate}
          onChange={(e) => patch("shopfloorSeparate", e.target.checked)}
        />
        <div className="flex items-center gap-3 flex-wrap pl-7">
          <Checkbox
            label="Destroy (ทำลาย)"
            checked={s.shopfloorDestroyed}
            onChange={(e) => patch("shopfloorDestroyed", e.target.checked)}
          />
          {s.shopfloorDestroyed && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted-fg)]">Destroyed date:</span>
              <DatePicker
                value={s.shopfloorDestroyDate}
                onChange={(d) => patch("shopfloorDestroyDate", d)}
              />
            </div>
          )}
        </div>
      </SectionCard>

      {/* ─── 7. QA Action ──────────────────────────────────────────── */}
      <SectionCard
        index={7}
        title="QA Action"
        signLabel="QA"
        signedBy={s.qaSignedBy}
        signedDate={s.qaSignedDate}
        onSignedBy={(v) => patch("qaSignedBy", v)}
        onSignedDate={(d) => patch("qaSignedDate", d)}
      >
        <p className="text-sm">
          Check product waiting for release which are the cancelled item, then inform the Planner
          <span className="block text-xs text-[var(--muted-fg)] mt-0.5">
            ตรวจสอบว่ามีสินค้ารอการ Release หรือไม่ แล้วแจ้ง Planner
          </span>
        </p>
        <YesNoRow
          value={s.qaHasReleaseWaiting}
          onChange={(v) => patch("qaHasReleaseWaiting", v)}
          noLabel="No (ไม่มีไอเทมยกเลิกที่เป็นสินค้ารอการ Release)"
          yesLabel="Yes (มีไอเทมยกเลิกที่เป็นสินค้ารอการ Release)"
        />
        <Checkbox
          label="Separate the PSS of the cancelled item and stamp 'Cancelled' on the front of the folder, recall from TNC to destroy"
          checked={s.qaSeparatePss}
          onChange={(e) => patch("qaSeparatePss", e.target.checked)}
        />
        <Checkbox
          label="Cancel the list of canceled items in the Color Standard Log"
          checked={s.qaCancelColorLog}
          onChange={(e) => patch("qaCancelColorLog", e.target.checked)}
        />
      </SectionCard>

      {/* ─── 8. Sales & CS Action (final) ──────────────────────────── */}
      <SectionCard
        index={8}
        title="Sales & CS Action — Final"
        signLabel="CS"
        signedBy={s.csFinalSignedBy}
        signedDate={s.csFinalSignedDate}
        onSignedBy={(v) => patch("csFinalSignedBy", v)}
        onSignedDate={(d) => patch("csFinalSignedDate", d)}
      >
        <Checkbox
          label="ตรวจเช็คว่าทุกแผนกทำการรับทราบการ Block จาก Block item in NAV (การยกเลิกรายการในระบบ NAV)"
          checked={s.csVerifyAllAck}
          onChange={(e) => patch("csVerifyAllAck", e.target.checked)}
        />
      </SectionCard>

      {/* ─── Actions ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2 sticky bottom-4 z-10 bg-[var(--background)]/80 backdrop-blur p-3 rounded-2xl border border-[var(--border)] shadow-sm">
        <Btn type="button" variant="ghost" onClick={() => router.back()} icon={<ArrowLeft className="w-4 h-4" />}>
          Cancel
        </Btn>
        <Btn type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>
          Save form
        </Btn>
      </div>
    </form>
  );
}

// ────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────

interface SectionCardProps {
  index: number;
  title: string;
  signLabel: string;
  signedBy: string;
  signedDate: Date | null;
  onSignedBy: (v: string) => void;
  onSignedDate: (d: Date | null) => void;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

function SectionCard({
  index,
  title,
  signLabel,
  signedBy,
  signedDate,
  onSignedBy,
  onSignedDate,
  extra,
  children,
}: SectionCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-7 h-7 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center text-sm font-bold">
          {index}
        </span>
        <h2 className="font-bold">{title}</h2>
      </div>
      <div className="space-y-3 mb-4">{children}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
        <Field label={`${signLabel} (ผู้รับทราบ)`}>
          <Input value={signedBy} onChange={(e) => onSignedBy(e.target.value)} />
        </Field>
        <Field label="Date">
          <DatePicker value={signedDate} onChange={onSignedDate} />
        </Field>
        {extra}
      </div>
    </Card>
  );
}

function YesNoRow({
  value,
  onChange,
  noLabel,
  yesLabel,
}: {
  value: YesNo;
  onChange: (v: YesNo) => void;
  noLabel: string;
  yesLabel: string;
}) {
  return (
    <div className="space-y-2 pl-1">
      <Checkbox
        label={noLabel}
        checked={value === "no"}
        onChange={(e) => onChange(e.target.checked ? "no" : "")}
      />
      <Checkbox
        label={yesLabel}
        checked={value === "yes"}
        onChange={(e) => onChange(e.target.checked ? "yes" : "")}
      />
    </div>
  );
}
