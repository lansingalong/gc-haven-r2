import { useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './AddMedicationModal.module.css'

interface AddMedicationModalProps {
  memberName: string
  dob: string
  memberId: string
  onClose: () => void
}

export function AddMedicationModal({ memberName, dob, memberId, onClose }: AddMedicationModalProps) {
  const [dosage, setDosage] = useState('40')
  const [unit, setUnit] = useState('mg')
  const [dosageForm, setDosageForm] = useState('Tablet')
  const [frequency, setFrequency] = useState('Daily')
  const [route, setRoute] = useState('Oral')
  const [prn, setPrn] = useState(false)
  const [days, setDays] = useState('')
  const [quantity, setQuantity] = useState('')
  const [dispensedDate, setDispensedDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startDateUnknown, setStartDateUnknown] = useState(false)
  const [endDate, setEndDate] = useState('')
  const [reconciliation, setReconciliation] = useState('')
  const [lastReconDate, setLastReconDate] = useState('')
  const [nextReconDate, setNextReconDate] = useState('')
  const [reconStatus, setReconStatus] = useState('')
  const [reconAction, setReconAction] = useState('')
  const [memberReport, setMemberReport] = useState('')
  const [sourceOfList, setSourceOfList] = useState('')
  const [reconNotes, setReconNotes] = useState('')
  const [currentTab, setCurrentTab] = useState<'current' | 'new'>('new')

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Add Medication">

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Add Medication</h2>
          </div>
          <button className={styles.closeBtn} type="button" aria-label="Close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className={styles.topAccent} />

        {/* Member info bar */}
        <div className={styles.memberBar}>
          <span className={styles.memberName}>{memberName}</span>
          <span className={styles.memberMeta}>DOB {dob}</span>
          <span className={styles.memberMeta}>Member ID {memberId}</span>
          <div className={styles.tabToggle}>
            <button
              type="button"
              className={`${styles.tabBtn} ${currentTab === 'current' ? styles.tabBtnActive : ''}`}
              onClick={() => setCurrentTab('current')}
            >Current</button>
            <button
              type="button"
              className={`${styles.tabBtn} ${currentTab === 'new' ? styles.tabBtnActive : ''}`}
              onClick={() => setCurrentTab('new')}
            >New ▾</button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p className={styles.required}>* Indicates required field</p>

          <div className={styles.columns}>
            {/* Left column */}
            <div className={styles.leftCol}>
              <p className={styles.sectionHeading}>MEDICATION</p>

              {/* Search medication box */}
              <div className={styles.searchBox}>
                <p className={styles.searchLabel}>Search Medication</p>
                <div className={styles.searchRow}>
                  <div className={styles.radioOption}>
                    <span className={styles.radioCircleActive} />
                    <span className={styles.fieldLabel}><span className={styles.star}>*</span>Medication Name</span>
                    <span className={styles.hintText}>If brand name doesn't appear, please check for generic name</span>
                  </div>
                </div>
                <div className={styles.searchInputRow}>
                  <select className={styles.selectSm} defaultValue="Starts With">
                    <option>Starts With</option>
                    <option>Contains</option>
                  </select>
                  <div className={styles.searchField}>
                    <input
                      className={styles.searchInput}
                      type="text"
                      defaultValue="Furosemide"
                      aria-label="Medication Name or Code"
                    />
                    <button className={styles.searchBtn} type="button" aria-label="Search">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className={styles.ndcRow}>
                  <span className={styles.radioCircle} />
                  <span className={styles.fieldLabel}>Add Medication without NDC</span>
                  <span className={styles.infoIcon}>ⓘ</span>
                </div>
              </div>

              {/* Dosage + Unit */}
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}><span className={styles.star}>*</span>Dosage</label>
                  <input className={styles.input} type="text" value={dosage} onChange={e => setDosage(e.target.value)} placeholder="Type here" />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}><span className={styles.star}>*</span>Unit</label>
                  <select className={styles.select} value={unit} onChange={e => setUnit(e.target.value)}>
                    <option value="">Select</option>
                    <option value="mg">mg</option>
                    <option value="mcg">mcg</option>
                    <option value="mL">mL</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              {/* Dosage Form + Frequency */}
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Dosage Form</label>
                  <select className={styles.select} value={dosageForm} onChange={e => setDosageForm(e.target.value)}>
                    <option value="">Select</option>
                    <option>Tablet</option>
                    <option>Capsule</option>
                    <option>Liquid</option>
                    <option>Patch</option>
                    <option>Injection</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}><span className={styles.star}>*</span>Frequency</label>
                  <select className={styles.select} value={frequency} onChange={e => setFrequency(e.target.value)}>
                    <option value="">Select</option>
                    <option>Daily</option>
                    <option>Twice daily</option>
                    <option>Three times daily</option>
                    <option>Weekly</option>
                    <option>As needed</option>
                  </select>
                </div>
              </div>

              {/* PRN + Route + Days */}
              <div className={styles.row3}>
                <div className={styles.fieldPrn}>
                  <label className={styles.fieldLabel}>PRN</label>
                  <input type="checkbox" checked={prn} onChange={e => setPrn(e.target.checked)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}><span className={styles.star}>*</span>Route</label>
                  <select className={styles.select} value={route} onChange={e => setRoute(e.target.value)}>
                    <option value="">Select</option>
                    <option>Oral</option>
                    <option>Topical</option>
                    <option>Intravenous</option>
                    <option>Subcutaneous</option>
                    <option>Inhaled</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Days</label>
                  <input className={styles.input} type="text" value={days} onChange={e => setDays(e.target.value)} placeholder="Type here" />
                </div>
              </div>

              {/* Quantity + Dispensed Date */}
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Quantity</label>
                  <input className={styles.input} type="text" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Type here" />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Dispensed Date <span className={styles.hintText}>MM/DD/YYYY</span></label>
                  <div className={styles.dateRow}>
                    <input className={styles.dateInput} type="text" placeholder="MM/DD/YYYY" value={dispensedDate} onChange={e => setDispensedDate(e.target.value)} />
                    <button className={styles.calBtn} type="button" aria-label="Pick date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Start Date + End Date */}
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}><span className={styles.star}>*</span>Current Start Date <span className={styles.hintText}>MM/DD/YYYY</span></label>
                  <div className={styles.dateRow}>
                    <input
                      className={styles.dateInput}
                      type="text"
                      placeholder="MM/DD/YYYY"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      disabled={startDateUnknown}
                    />
                    <button className={styles.calBtn} type="button" aria-label="Pick date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                      </svg>
                    </button>
                  </div>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" checked={startDateUnknown} onChange={e => setStartDateUnknown(e.target.checked)} />
                    <span>Start Date Unknown</span>
                  </label>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Current End Date <span className={styles.hintText}>MM/DD/YYYY</span></label>
                  <div className={styles.dateRow}>
                    <input className={styles.dateInput} type="text" placeholder="MM/DD/YYYY" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    <button className={styles.calBtn} type="button" aria-label="Pick date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className={styles.rightCol}>
              <p className={styles.sectionHeading}>RECONCILIATION UPDATES</p>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Reconciliation</label>
                <select className={styles.select} value={reconciliation} onChange={e => setReconciliation(e.target.value)}>
                  <option value="">Select</option>
                  <option>Confirmed</option>
                  <option>Discontinued</option>
                  <option>Changed</option>
                </select>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Last Reconciliation Date <span className={styles.hintText}>MM/DD/YYYY</span></label>
                  <div className={styles.dateRow}>
                    <input className={styles.dateInput} type="text" placeholder="MM/DD/YYYY" value={lastReconDate} onChange={e => setLastReconDate(e.target.value)} />
                    <button className={styles.calBtn} type="button" aria-label="Pick date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Next Reconciliation Date <span className={styles.hintText}>MM/DD/YYYY</span></label>
                  <div className={styles.dateRow}>
                    <input className={styles.dateInput} type="text" placeholder="MM/DD/YYYY" value={nextReconDate} onChange={e => setNextReconDate(e.target.value)} />
                    <button className={styles.calBtn} type="button" aria-label="Pick date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Reconciliation Status</label>
                  <select className={styles.select} value={reconStatus} onChange={e => setReconStatus(e.target.value)}>
                    <option value="">Select</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Reconciliation Action</label>
                  <select className={styles.select} value={reconAction} onChange={e => setReconAction(e.target.value)}>
                    <option value="">Select</option>
                    <option>Add</option>
                    <option>Remove</option>
                    <option>Update</option>
                  </select>
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Member/Caregiver Report</label>
                  <select className={styles.select} value={memberReport} onChange={e => setMemberReport(e.target.value)}>
                    <option value="">Select</option>
                    <option>Taking as prescribed</option>
                    <option>Not taking</option>
                    <option>Side effects reported</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Source of List</label>
                  <select className={styles.select} value={sourceOfList} onChange={e => setSourceOfList(e.target.value)}>
                    <option value="">Select</option>
                    <option>Pharmacy</option>
                    <option>Member</option>
                    <option>Provider</option>
                    <option>Discharge summary</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Reconciled By</label>
                <input className={styles.input} type="text" defaultValue="Beatrice" readOnly />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Reconciliation Notes</label>
                <textarea
                  className={styles.textarea}
                  value={reconNotes}
                  onChange={e => setReconNotes(e.target.value)}
                  placeholder="Add notes here"
                  rows={5}
                  maxLength={5000}
                />
                <span className={styles.charCount}>{5000 - reconNotes.length} characters remaining</span>
              </div>

              <button className={styles.uploadBtn} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload Documents
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.saveAddBtn} type="button">Save &amp; Add More Medication</button>
          <button className={styles.addCloseBtn} type="button" onClick={onClose}>Add &amp; Close Medication</button>
          <button className={styles.cancelBtn} type="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>,
    document.body
  )
}
