export type CheckResult = "PASS" | "FAIL" | "NOT_RUN";

export type EvidenceRow = {
  id: string;
  pillar: string;
  label?: string;
  result: CheckResult;
  value?: number;
  threshold?: number;
  units?: string;
  evidence?: string;
  at: string;
};

export class ContractEvidenceContext {
  private rows: EvidenceRow[] = [];

  pass(row: Omit<EvidenceRow, "result" | "at">) {
    this.rows.push({ ...row, result: "PASS", at: new Date().toISOString() });
  }

  fail(row: Omit<EvidenceRow, "result" | "at">) {
    this.rows.push({ ...row, result: "FAIL", at: new Date().toISOString() });
  }

  toJSON() {
    return this.rows;
  }
}
