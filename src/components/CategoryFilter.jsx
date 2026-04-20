import { useAutoTranslateText } from '../hooks/useAutoTranslate';
import useI18n from '../hooks/useI18n';

function CategoryOption({ category }) {
  const translatedCategory = useAutoTranslateText(category);

  return (
    <option
      key={category}
      value={category}
    >
      #{translatedCategory}
    </option>
  );
}

function CategoryFilter({ activeCategory, categories, onChangeCategory }) {
  const { t } = useI18n();
  const activeCategoryLabel = useAutoTranslateText(
    activeCategory === 'all' ? t('common.all') : activeCategory,
  );

  function onChangeSelectCategory(event) {
    const selectedCategory = event.target.value;

    if (!selectedCategory) {
      return;
    }

    onChangeCategory(selectedCategory);
  }

  if (!categories.length) {
    return null;
  }

  return (
    <section className="section-block" aria-labelledby="popular-category">
      <h2 id="popular-category" className="section-title section-title--small">{t('home.popularCategory')}</h2>
      <div className="category-filter-row">
        <button
          type="button"
          className={`chip ${activeCategory === 'all' ? 'chip--active' : ''}`}
          onClick={() => onChangeCategory('all')}
        >
          {t('common.all')}
        </button>

        <label className="category-select" htmlFor="categoryDropdown">
          <span className="category-select__label">{t('home.categoryDropdownLabel')}</span>
          <select
            id="categoryDropdown"
            value={activeCategory === 'all' ? '' : activeCategory}
            onChange={onChangeSelectCategory}
            aria-label={t('home.categoryDropdownLabel')}
          >
            <option value="">{t('home.categoryDropdownPlaceholder')}</option>
            {categories.map((category) => (
              <CategoryOption key={category} category={category} />
            ))}
          </select>
        </label>

        <p className="category-filter__active" aria-live="polite">
          {t('home.categoryActiveLabel', { category: activeCategoryLabel })}
        </p>
      </div>
    </section>
  );
}

export default CategoryFilter;
