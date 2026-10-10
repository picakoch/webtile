// Admin page to download newsletter subscriptions as CSV (replaces
// strapi-plugin-excel-export-2024, which has no Strapi 5 version).
// Reads through the content manager API, so the admin's own session and
// permissions apply.
import { useState } from 'react';
import { Layouts, Page, useFetchClient } from '@strapi/strapi/admin';
import { Box, Button, Typography } from '@strapi/design-system';
import { Download } from '@strapi/icons';

const UID = 'api::newsletter-subscription.newsletter-subscription';
const COLUMNS = ['name', 'email', 'subscription_date'];

const csvCell = (value) => {
  let text = value == null ? '' : String(value);
  // Names come from the public form: stop Excel from running "=..." formulas
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const NewsletterExport = () => {
  const { get } = useFetchClient();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const download = async () => {
    setLoading(true);
    setStatus('');
    try {
      const rows = [];
      for (let page = 1, pageCount = 1; page <= pageCount; page++) {
        const { data } = await get(`/content-manager/collection-types/${UID}`, {
          params: { page, pageSize: 100, sort: 'subscription_date:ASC' },
        });
        rows.push(...data.results);
        pageCount = data.pagination.pageCount;
      }
      const csv = [COLUMNS, ...rows.map((row) => COLUMNS.map((c) => row[c]))]
        .map((line) => line.map(csvCell).join(','))
        .join('\n');
      // BOM so Excel reads accents as UTF-8
      const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      setStatus(`${rows.length} subscriptions exported.`);
    } catch (error) {
      setStatus(`Export failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page.Main>
      <Page.Title>Newsletter export</Page.Title>
      <Layouts.Header
        title="Newsletter export"
        subtitle="Download the newsletter subscriptions as a CSV file (opens in Excel)."
      />
      <Layouts.Content>
        <Box background="neutral0" padding={6} shadow="filterShadow" hasRadius>
          <Button startIcon={<Download />} onClick={download} loading={loading}>
            Download CSV
          </Button>
          {status && (
            <Box paddingTop={4}>
              <Typography>{status}</Typography>
            </Box>
          )}
        </Box>
      </Layouts.Content>
    </Page.Main>
  );
};

export default NewsletterExport;
