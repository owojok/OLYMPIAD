import React, { useState, useMemo } from 'react';
import { useChecklists } from '../hooks/useChecklists';
import { CheckSquare, ClipboardList, CheckCircle, Search, RefreshCw } from 'lucide-react';
import './Checklist.css';

export const ChecklistView: React.FC = () => {
  const { categories, toggleItem, isChecked, categoryProgress } = useChecklists();
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeTab, setActiveTypeTab] = useState<'material' | 'post-event'>('material');

  // Filter categories by type (material vs post-event)
  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.type === activeTypeTab);
  }, [categories, activeTypeTab]);

  // Adjust activeCategoryIdx if it is out of bounds for the filtered list
  const activeCategory = useMemo(() => {
    if (filteredCategories.length === 0) return null;
    const cat = filteredCategories[activeCategoryIdx] || filteredCategories[0];
    return cat;
  }, [filteredCategories, activeCategoryIdx]);

  // Search filtered checklist items
  const filteredItems = useMemo(() => {
    if (!activeCategory) return [];
    if (searchQuery.trim() === '') return activeCategory.items;
    const query = searchQuery.toLowerCase();
    return activeCategory.items.filter(item => item.toLowerCase().includes(query));
  }, [activeCategory, searchQuery]);

  const progress = activeCategory ? categoryProgress[activeCategory.name] : { completed: 0, total: 0, percent: 0 };

  return (
    <div className="checklist-container animate-fade-in">
      <div className="checklist-header glass-panel">
        <h2 className="text-gradient">Tournament Checklist Center</h2>
        <p className="subtitle">Interactive logistical checklists for registration, labs, command operations, and post-event restoration.</p>
        
        <div className="type-tabs">
          <button
            className={`type-tab ${activeTypeTab === 'material' ? 'active' : ''}`}
            onClick={() => {
              setActiveTypeTab('material');
              setActiveCategoryIdx(0);
              setSearchQuery('');
            }}
          >
            <ClipboardList size={16} /> Equipment & Material Checklist
          </button>
          <button
            className={`type-tab ${activeTypeTab === 'post-event' ? 'active' : ''}`}
            onClick={() => {
              setActiveTypeTab('post-event');
              setActiveCategoryIdx(0);
              setSearchQuery('');
            }}
          >
            <RefreshCw size={16} /> Post-Event Tasks Checklist
          </button>
        </div>
      </div>

      <div className="checklist-layout-grid">
        {/* Navigation Sidebar for Categories */}
        <div className="checklist-sidebar glass-panel">
          <h3>Categories</h3>
          <div className="category-list">
            {filteredCategories.map((cat, idx) => {
              const catProgress = categoryProgress[cat.name] || { completed: 0, total: 0, percent: 0 };
              const currentActive = activeCategory && activeCategory.name === cat.name;
              return (
                <button
                  key={cat.name}
                  className={`category-nav-btn ${currentActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategoryIdx(idx);
                    setSearchQuery('');
                  }}
                >
                  <div className="cat-btn-info">
                    <span className="cat-name">{cat.name.replace('Post-Event: ', '')}</span>
                    <span className="cat-count">{catProgress.completed}/{catProgress.total} checked</span>
                  </div>
                  <div className="cat-btn-meter-container">
                    <div 
                      className="cat-btn-meter-fill" 
                      style={{ 
                        width: `${catProgress.percent}%`,
                        backgroundColor: catProgress.percent === 100 ? 'var(--color-success)' : 'var(--color-primary)'
                      }}
                    ></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Checklist List Panel */}
        <div className="checklist-main-panel">
          {activeCategory ? (
            <div className="checklist-panel glass-panel animate-scale-in">
              <div className="checklist-panel-header">
                <div>
                  <h2>{activeCategory.name.replace('Post-Event: ', '')} Checklist</h2>
                  <p className="item-count">
                    {progress.completed} of {progress.total} items completed ({progress.percent}%)
                  </p>
                </div>
                
                <div className="panel-progress-bar">
                  <div 
                    className="panel-progress-fill" 
                    style={{ 
                      width: `${progress.percent}%`,
                      backgroundColor: progress.percent === 100 ? 'var(--color-success)' : 'var(--color-primary)'
                    }}
                  ></div>
                </div>
              </div>

              <div className="checklist-search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder={`Search in ${activeCategory.name.replace('Post-Event: ', '')}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="checklist-items-list">
                {filteredItems.length === 0 ? (
                  <div className="empty-state">
                    <p>No checklist items match your search.</p>
                  </div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const checked = isChecked(activeCategory.name, item);
                    return (
                      <div 
                        key={idx}
                        className={`checklist-item-card glass-card ${checked ? 'checked' : ''}`}
                        onClick={() => toggleItem(activeCategory.name, item)}
                      >
                        <div className="checkbox-wrapper">
                          {checked ? (
                            <CheckCircle size={20} className="check-icon success" />
                          ) : (
                            <div className="unchecked-box" />
                          )}
                        </div>
                        <span className="item-text">{item}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="sidebar-empty glass-panel">
              <CheckSquare size={36} />
              <h3>Select a Checklist Category</h3>
              <p>Choose a category from the sidebar menu to verify equipment logistics and compliance tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ChecklistView;
