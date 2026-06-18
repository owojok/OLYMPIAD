import React, { useState, useMemo } from 'react';
import { useBudget } from '../hooks/useBudget';
import { RISK_MATRIX } from '../../../data/eventData';
import { RefreshCcw, Search, AlertCircle, HelpCircle } from 'lucide-react';
import './Budget.css';

export const BudgetView: React.FC = () => {
  const {
    budgetItems,
    errorMap,
    updateItemCost,
    totalCost,
    originalTotal,
    resetBudget
  } = useBudget();

  // Risk filters state
  const [riskQuery, setRiskQuery] = useState('');
  const [selectedLikelihood, setSelectedLikelihood] = useState<string>('All');
  const [selectedImpact, setSelectedImpact] = useState<string>('All');

  // Filtered risks
  const filteredRisks = useMemo(() => {
    return RISK_MATRIX.filter(riskItem => {
      // 1. Likelihood
      if (selectedLikelihood !== 'All' && riskItem.likelihood !== selectedLikelihood) return false;
      // 2. Impact
      if (selectedImpact !== 'All' && riskItem.impact !== selectedImpact) return false;
      // 3. Search query
      if (riskQuery.trim() !== '') {
        const query = riskQuery.toLowerCase();
        return (
          riskItem.risk.toLowerCase().includes(query) ||
          riskItem.mitigation.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [riskQuery, selectedLikelihood, selectedImpact]);

  const diff = totalCost - originalTotal;
  const isOverBudget = diff > 0;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'badge-danger';
      case 'Medium': return 'badge-warning';
      case 'Low': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="budget-container animate-fade-in">
      <div className="budget-header glass-panel">
        <h2 className="text-gradient">Financials & Risk Management</h2>
        <p className="subtitle">Interactive budget estimates (dynamic sums & local storage updates) paired with our operational risk matrix.</p>
        
        <div className="budget-summary-panel">
          <div className="summary-metric">
            <span className="label">Total Adjusted Cost</span>
            <span className={`value ${isOverBudget ? 'danger' : 'success'}`}>
              ₦{totalCost.toLocaleString()}
            </span>
          </div>

          <div className="summary-metric">
            <span className="label">Original Baseline</span>
            <span className="value">₦{originalTotal.toLocaleString()}</span>
          </div>

          <div className="summary-metric">
            <span className="label">Variance</span>
            <span className={`value ${isOverBudget ? 'danger' : 'neutral'}`}>
              {diff === 0 ? '₦0' : `${isOverBudget ? '+' : ''}₦${diff.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>

      <div className="budget-split-grid">
        {/* Interactive Spreadsheet */}
        <div className="spreadsheet-panel glass-panel">
          <div className="panel-header-row">
            <h3>Budget Allocation Worksheet</h3>
            <button className="btn btn-secondary btn-sm" onClick={resetBudget}>
              <RefreshCcw size={14} /> Reset Baseline
            </button>
          </div>
          <p className="panel-desc">Modify estimated costs directly. Cost values persist locally.</p>

          <div className="spreadsheet-table-wrapper">
            <table className="spreadsheet-table">
              <thead>
                <tr>
                  <th>Logistical Line Item</th>
                  <th style={{ width: '180px' }}>Estimated Cost (₦)</th>
                </tr>
              </thead>
              <tbody>
                {budgetItems.map((item, idx) => {
                  const error = errorMap[idx];
                  return (
                    <tr key={idx} className={error ? 'row-error' : ''}>
                      <td>
                        <div className="item-name-cell">
                          {item.item}
                          {error && <span className="error-text-cell"><AlertCircle size={12} /> {error}</span>}
                        </div>
                      </td>
                      <td>
                        <div className="cost-input-wrapper">
                          <span className="currency-symbol">₦</span>
                          <input
                            type="text"
                            value={item.cost.toString()}
                            onChange={(e) => updateItemCost(idx, e.target.value)}
                            className={error ? 'input-error' : ''}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Management Section */}
        <div className="risk-panel glass-panel">
          <h3>Risk Assessment Matrix</h3>
          <p className="panel-desc">Evaluate probability levels, security impacts, and mitigations.</p>

          <div className="risk-filters glass-card">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search risks or mitigations..."
                value={riskQuery}
                onChange={(e) => setRiskQuery(e.target.value)}
              />
            </div>

            <div className="risk-chips-group">
              <div className="chip-row">
                <span className="chip-label">Likelihood:</span>
                {['All', 'High', 'Medium', 'Low'].map(lvl => (
                  <button
                    key={lvl}
                    className={`risk-chip ${selectedLikelihood === lvl ? 'active' : ''}`}
                    onClick={() => setSelectedLikelihood(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <div className="chip-row">
                <span className="chip-label">Impact:</span>
                {['All', 'High', 'Medium', 'Low'].map(lvl => (
                  <button
                    key={lvl}
                    className={`risk-chip ${selectedImpact === lvl ? 'active' : ''}`}
                    onClick={() => setSelectedImpact(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="risks-list">
            {filteredRisks.length === 0 ? (
              <div className="empty-state">
                <HelpCircle size={32} />
                <p>No risk scenarios match your search filters.</p>
              </div>
            ) : (
              filteredRisks.map((risk, index) => (
                <div key={index} className="risk-card-item glass-card animate-scale-in">
                  <div className="risk-card-header">
                    <h4>{risk.risk}</h4>
                    <div className="risk-badges">
                      <span className={`badge ${getRiskColor(risk.likelihood)}`}>L: {risk.likelihood}</span>
                      <span className={`badge ${getRiskColor(risk.impact)}`}>I: {risk.impact}</span>
                    </div>
                  </div>
                  <div className="risk-mitigation">
                    <strong>Mitigation Protocol:</strong> {risk.mitigation}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BudgetView;
