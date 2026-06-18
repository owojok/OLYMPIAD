import { useState, useEffect, useMemo } from 'react';
import { MATERIAL_CHECKLISTS, POST_EVENT_CHECKLIST } from '../../../data/eventData';

export interface ChecklistCategory {
  name: string;
  items: string[];
  type: 'material' | 'post-event';
}

export const useChecklists = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // Consolidate categories
  const categories = useMemo<ChecklistCategory[]>(() => {
    const materialCats = Object.entries(MATERIAL_CHECKLISTS).map(([name, items]) => ({
      name,
      items,
      type: 'material' as const
    }));

    const postEventCats = Object.entries(POST_EVENT_CHECKLIST).map(([name, items]) => ({
      name: `Post-Event: ${name}`,
      items,
      type: 'post-event' as const
    }));

    return [...materialCats, ...postEventCats];
  }, []);

  // Load state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_checklist_checked');
      if (stored) {
        setCheckedItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load checklist state from localStorage', e);
    }
  }, []);

  const toggleItem = (categoryName: string, item: string) => {
    const key = `${categoryName}::${item}`;
    const nextState = checkedItems.includes(key)
      ? checkedItems.filter((k) => k !== key)
      : [...checkedItems, key];

    setCheckedItems(nextState);
    try {
      localStorage.setItem('so_checklist_checked', JSON.stringify(nextState));
    } catch (e) {
      console.error('Failed to save checklist state to localStorage', e);
    }
  };

  const isChecked = (categoryName: string, item: string) => {
    return checkedItems.includes(`${categoryName}::${item}`);
  };

  // Get progress by category
  const categoryProgress = useMemo(() => {
    const progress: { [catName: string]: { completed: number; total: number; percent: number } } = {};
    
    categories.forEach((cat) => {
      let completedCount = 0;
      cat.items.forEach((item) => {
        if (checkedItems.includes(`${cat.name}::${item}`)) {
          completedCount++;
        }
      });

      const total = cat.items.length;
      const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
      progress[cat.name] = { completed: completedCount, total, percent };
    });

    return progress;
  }, [categories, checkedItems]);

  return {
    categories,
    toggleItem,
    isChecked,
    categoryProgress
  };
};
export default useChecklists;
