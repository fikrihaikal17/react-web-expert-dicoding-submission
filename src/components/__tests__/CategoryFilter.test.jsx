import { fireEvent, render, screen } from '@testing-library/react';
import CategoryFilter from '../CategoryFilter';

jest.mock('../../hooks/useI18n', () => jest.fn(() => ({
  t: (key, params = {}) => {
    if (key === 'common.all') {
      return 'All';
    }

    if (key === 'home.popularCategory') {
      return 'Popular categories';
    }

    if (key === 'home.categoryDropdownLabel') {
      return 'Choose category';
    }

    if (key === 'home.categoryDropdownPlaceholder') {
      return 'Select category';
    }

    if (key === 'home.categoryActiveLabel') {
      return `Active category: ${params.category}`;
    }

    return key;
  },
})));

jest.mock('../../hooks/useAutoTranslate', () => ({
  useAutoTranslateText: (value) => value,
}));

/**
 * Skenario test:
 * - should render category filter controls and active category text.
 * - should call callback when selecting category from dropdown or All button.
 */

describe('CategoryFilter component', () => {
  it('should render controls and active category label', () => {
    render(
      <CategoryFilter
        activeCategory="all"
        categories={['react', 'redux']}
        onChangeCategory={jest.fn()}
      />,
    );

    expect(screen.getByText('Popular categories')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByLabelText('Choose category')).toBeInTheDocument();
    expect(screen.getByText('Active category: All')).toBeInTheDocument();
  });

  it('should call onChangeCategory on interactions', () => {
    const onChangeCategory = jest.fn();

    render(
      <CategoryFilter
        activeCategory="all"
        categories={['react', 'redux']}
        onChangeCategory={onChangeCategory}
      />,
    );

    fireEvent.change(screen.getByLabelText('Choose category'), {
      target: { value: 'redux' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'All' }));

    expect(onChangeCategory).toHaveBeenNthCalledWith(1, 'redux');
    expect(onChangeCategory).toHaveBeenNthCalledWith(2, 'all');
  });
});
