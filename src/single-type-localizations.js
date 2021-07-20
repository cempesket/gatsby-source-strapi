import axios from 'axios';

const fetchAndMergeLocales = async (ctx, singleTypes) => {
  const results = await Promise.all(
    singleTypes
      .filter((o) => o.api.qs._locale)
      .map((o) =>
        axios.get(`${ctx.apiURL}/${o.name}?_locale=all&_publicationState=preview`).then((r) => {
          return { ...r, name: o.name };
        })
      )
  );

  return results
    .map(({ data, name }) => {
      const locales = data['localizations'].map((l) => l.locale);

      return locales.map((l) => {
        return {
          name,
          api: {
            qs: {
              _locale: l,
              _publicationState: 'preview',
            },
          },
        };
      });
    })
    .flat();
};

module.exports = fetchAndMergeLocales;
