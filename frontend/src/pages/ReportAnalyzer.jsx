import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

function ReportAnalyzer() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [fileType, setFileType] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    setError('');
    setExtractedText('');
    setFileType('');
    setCopied(false);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setFile(null);
      setError('Please select a PDF, JPG or PNG file.');
      event.target.value = '';
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError('The report must be 8 MB or smaller.');
      event.target.value = '';
      return;
    }

    setFile(selectedFile);
  }

  async function handleExtract(event) {
    event.preventDefault();

    if (!file) {
      setError('Please choose a report first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setExtractedText('');
    setFileType('');

    try {
      const formData = new FormData();
      formData.append('report', file);

      const response = await apiFetch('/api/report-analyzer', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to extract report text.');
      }

      setExtractedText(data.extractedText || '');
      setFileType(data.fileType || '');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
    } catch {
      setError(
        'Clipboard access failed. Please select and copy the text manually.',
      );
    }
  }

  function handleReset() {
    setFile(null);
    setExtractedText('');
    setFileType('');
    setError('');
    setCopied(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="cure-analyzer">
      <style>{`
        .cure-analyzer {
          --ca-ink: #173b37;
          --ca-muted: #78877f;
          --ca-green: #245e52;
          --ca-cream: #f7f5ee;
          --ca-line: #e6e8df;
          min-height: 100vh;
          padding-bottom: 55px;
          background: var(--ca-cream);
          color: var(--ca-ink);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }
        .cure-analyzer * { box-sizing: border-box; }
        .ca-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 6%;
          border-bottom: 1px solid var(--ca-line);
          background: #fffefa;
        }
        .ca-brand {
          color: var(--ca-ink);
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -1px;
          text-decoration: none;
        }
        .ca-brand span { color: #6b8c77; font-weight: 500; }
        .ca-header a:last-child {
          color: var(--ca-green);
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }
        .ca-main {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 38px 24px;
        }
        .ca-breadcrumb {
          margin-bottom: 26px;
          color: var(--ca-muted);
          font-size: 12px;
        }
        .ca-breadcrumb a { color: var(--ca-green); text-decoration: none; }
        .ca-eyebrow {
          color: #658675;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }
        .ca-heading h1 {
          margin: 10px 0;
          font-size: clamp(29px, 4vw, 39px);
          letter-spacing: -1.4px;
        }
        .ca-heading p {
          max-width: 680px;
          color: var(--ca-muted);
          font-size: 13px;
          line-height: 1.8;
        }
        .ca-panel {
          margin-top: 26px;
          padding: 25px;
          border: 1px solid var(--ca-line);
          border-radius: 16px;
          background: #fffefa;
        }
        .ca-panel h2 {
          margin: 0 0 8px;
          font-size: 18px;
        }
        .ca-description {
          margin: 0 0 20px;
          color: var(--ca-muted);
          font-size: 12px;
          line-height: 1.7;
        }
        .ca-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 190px;
          padding: 25px;
          border: 1.5px dashed #b8cbb9;
          border-radius: 13px;
          background: #f7f8f1;
          text-align: center;
        }
        .ca-file-icon {
          display: grid;
          width: 49px;
          height: 49px;
          margin-bottom: 12px;
          place-items: center;
          border-radius: 15px;
          background: #e7efe5;
          color: var(--ca-green);
          font-size: 24px;
        }
        .ca-dropzone strong { font-size: 13px; }
        .ca-dropzone p {
          margin: 7px 0 13px;
          color: var(--ca-muted);
          font-size: 11px;
        }
        .ca-file-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .ca-upload-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 22px;
          border-radius: 9px;
          background: var(--ca-green);
          color: #fff;
          cursor: pointer;
          font-size: 12px;
          font-weight: 750;
          transition: background 0.2s ease;
        }

        .ca-upload-trigger:hover {
          background: #19483f;
        }

        .ca-upload-trigger:focus-within {
          outline: 3px solid #a9c9ad;
          outline-offset: 3px;
        }
        .ca-file-name {
          margin-top: 13px;
          color: var(--ca-green);
          font-size: 11px;
          font-weight: 700;
          overflow-wrap: anywhere;
        }
        .ca-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 19px;
        }
        .ca-button {
          padding: 12px 17px;
          border: 0;
          border-radius: 9px;
          background: var(--ca-green);
          color: white;
          cursor: pointer;
          font: inherit;
          font-size: 11px;
          font-weight: 750;
        }
        .ca-button:disabled {
          cursor: not-allowed;
          opacity: .55;
        }
        .ca-button.secondary {
          border: 1px solid #dce4d9;
          background: #f5f7f0;
          color: var(--ca-green);
        }
        .ca-error {
          margin-top: 16px;
          padding: 12px 14px;
          border: 1px solid #efd5d0;
          border-radius: 9px;
          background: #fff5f2;
          color: #a44e43;
          font-size: 12px;
          line-height: 1.6;
        }
        .ca-result {
          margin-top: 25px;
          overflow: hidden;
          border: 1px solid var(--ca-line);
          border-radius: 14px;
          background: #fffefa;
        }
        .ca-result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 17px 20px;
          border-bottom: 1px solid var(--ca-line);
        }
        .ca-result-header h2 {
          margin: 0;
          font-size: 16px;
        }
        .ca-result-header span {
          color: #54705e;
          font-size: 10px;
          font-weight: 750;
        }
        .ca-result-body { padding: 19px; }
        .ca-result-body textarea {
          display: block;
          width: 100%;
          min-height: 280px;
          resize: vertical;
          padding: 15px;
          border: 1px solid #e0e5db;
          border-radius: 10px;
          outline: none;
          background: #fcfcf8;
          color: var(--ca-ink);
          font: 12px/1.8 ui-monospace, Consolas, monospace;
        }
        .ca-result-body textarea:focus {
          border-color: #79a18a;
          box-shadow: 0 0 0 3px #4678591a;
        }
        .ca-notice {
          margin-top: 22px;
          padding: 16px 18px;
          border: 1px solid #e5e9de;
          border-radius: 12px;
          background: #f0f3e9;
          color: #64776b;
          font-size: 11px;
          line-height: 1.8;
        }
        .ca-notice strong { color: #315a45; }
        .ca-footer {
          margin-top: 25px;
          color: #89968c;
          font-size: 10px;
          line-height: 1.8;
        }
        @media (max-width: 600px) {
          .ca-main { padding: 27px 16px; }
          .ca-panel { padding: 17px; }
          .ca-result-header { align-items: flex-start; flex-direction: column; }
        }
      `}</style>

      <header className="ca-header">
        <Link to="/" className="ca-brand">
          Cure<span>AI</span>
        </Link>
        <Link to="/reports">Back to reports</Link>
      </header>

      <main className="ca-main">
        <div className="ca-breadcrumb">
          <Link to="/dashboard">Dashboard</Link> &nbsp;/&nbsp;
          <Link to="/reports">Reports</Link> &nbsp;/&nbsp; Analyzer
        </div>

        <section className="ca-heading">
          <div className="ca-eyebrow">DOCUMENT INTELLIGENCE</div>
          <h1>Medical Report Analyzer</h1>
          <p>
            Upload a medical report to extract its readable text. Review the
            extracted content carefully and compare it with your original
            document.
          </p>
        </section>

        <form className="ca-panel" onSubmit={handleExtract}>
          <h2>Upload your report</h2>
          <p className="ca-description">
            Supported formats: PDF, JPG and PNG. Maximum file size: 8 MB.
          </p>

          <div className="ca-dropzone">
            <span className="ca-file-icon" aria-hidden="true">
              ↑
            </span>

            <strong>Choose a report from your device</strong>

            <p>PDF, JPG or PNG · Maximum 8 MB</p>

            <label htmlFor="ca-report-file" className="ca-upload-trigger">
              Browse Files
            </label>

            <input
              id="ca-report-file"
              ref={fileInputRef}
              className="ca-file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={handleFileChange}
              aria-label="Choose a medical report"
              disabled={isLoading}
            />

            {file && (
              <div className="ca-file-name">
                {file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            )}
          </div>

          {error && (
            <div className="ca-error" role="alert">
              {error}
            </div>
          )}

          <div className="ca-actions">
            <button
              className="ca-button"
              type="submit"
              disabled={!file || isLoading}
            >
              {isLoading ? 'Extracting text...' : 'Extract report text'}
            </button>
            <button
              className="ca-button secondary"
              type="button"
              onClick={handleReset}
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
        </form>

        {extractedText && (
          <section className="ca-result" aria-labelledby="ca-result-title">
            <div className="ca-result-header">
              <h2 id="ca-result-title">Extracted report text</h2>
              <span>
                {fileType === 'pdf' ? 'PDF TEXT EXTRACTION' : 'IMAGE OCR'}
              </span>
            </div>
            <div className="ca-result-body">
              <p className="ca-description">
                Review and correct this text against your original report.
                Extraction can contain recognition errors.
              </p>
              <textarea
                value={extractedText}
                onChange={(event) => {
                  setExtractedText(event.target.value);
                  setCopied(false);
                }}
                aria-label="Extracted report text, editable for corrections"
                spellCheck="false"
              />
              <div className="ca-actions">
                <button
                  type="button"
                  className="ca-button"
                  onClick={handleCopy}
                >
                  {copied ? 'Copied' : 'Copy extracted text'}
                </button>
              </div>
            </div>
          </section>
        )}

        <aside className="ca-notice">
          <strong>Important medical and privacy notice</strong>
          <br />
          This feature extracts text only. It does not diagnose a condition,
          interpret clinical findings, verify laboratory values, or
          automatically populate assessment forms. Always verify extracted
          information with the original report and consult a qualified
          healthcare professional. Uploaded files are processed in memory and
          are not intentionally stored by this endpoint.
        </aside>

        <footer className="ca-footer">
          CureAI · Intelligence for Wellness
        </footer>
      </main>
    </div>
  );
}

export default ReportAnalyzer;
