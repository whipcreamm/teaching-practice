const fs = require('fs');
const content = [
  import React, { useEffect, useState } from 'react';,
  import TermSwitcher from './TermSwitcher';,
  import { getStoredData } from '@/lib/data-store';,
  import { LessonPlanItem, TermType } from '@/lib/types';,
  import { formatPdfEmbedUrl, openPdfDocument } from '@/lib/utils';,
  import { BookOpen, Download, ExternalLink, Clock } from 'lucide-react';,
].join('\n');
console.log(content.substring(0, 100));
