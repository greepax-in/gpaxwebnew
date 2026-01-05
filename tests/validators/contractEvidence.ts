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

export type DiagnosticRow = {
  id: string;
  pillar: string;
  severity: "INFO" | "WARN";
  message: string;
  at: string;
};

export class ContractEvidenceContext {
  private rows: EvidenceRow[] = [];
  private diagnostics: DiagnosticRow[] = [];

  diagnostic(row: Omit<DiagnosticRow, "at">) {
    this.diagnostics.push({ ...row, at: new Date().toISOString() });
  }

  pass(row: Omit<EvidenceRow, "result" | "at">) {
    this.rows.push({ ...row, result: "PASS", at: new Date().toISOString() });
  }

  fail(row: Omit<EvidenceRow, "result" | "at">) {
    this.rows.push({ ...row, result: "FAIL", at: new Date().toISOString() });
  }

  note(row: Omit<EvidenceRow, "result" | "at">) {
    this.rows.push({ ...row, result: "NOT_RUN", at: new Date().toISOString() });
  }

  toJSON() {
    return {
      evidence: this.rows,
      diagnostics: this.diagnostics,
    };
  }
}
