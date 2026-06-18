import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChecklists } from './useChecklists';

describe('useChecklists hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with unchecked items', () => {
    const { result } = renderHook(() => useChecklists());
    
    expect(result.current.categories.length).toBeGreaterThan(0);
    
    // Check if progress is 0% for all categories
    const progressMap = result.current.categoryProgress;
    Object.keys(progressMap).forEach(key => {
      expect(progressMap[key].completed).toBe(0);
      expect(progressMap[key].percent).toBe(0);
    });
  });

  it('should toggle items and update progress', () => {
    const { result } = renderHook(() => useChecklists());
    const firstCategory = result.current.categories[0];
    const firstItem = firstCategory.items[0];

    expect(result.current.isChecked(firstCategory.name, firstItem)).toBe(false);

    // Toggle check
    act(() => {
      result.current.toggleItem(firstCategory.name, firstItem);
    });

    expect(result.current.isChecked(firstCategory.name, firstItem)).toBe(true);
    expect(result.current.categoryProgress[firstCategory.name].completed).toBe(1);
    expect(result.current.categoryProgress[firstCategory.name].percent).toBeGreaterThan(0);

    // Toggle back to unchecked
    act(() => {
      result.current.toggleItem(firstCategory.name, firstItem);
    });

    expect(result.current.isChecked(firstCategory.name, firstItem)).toBe(false);
    expect(result.current.categoryProgress[firstCategory.name].completed).toBe(0);
  });

  it('should load initial state from localStorage', () => {
    const categoryName = 'Registration Desk';
    const itemName = 'Lanyards';
    const localStorageKey = 'so_checklist_checked';
    
    localStorage.setItem(localStorageKey, JSON.stringify([`${categoryName}::${itemName}`]));

    const { result } = renderHook(() => useChecklists());

    expect(result.current.isChecked(categoryName, itemName)).toBe(true);
    expect(result.current.categoryProgress[categoryName].completed).toBe(1);
  });
});
