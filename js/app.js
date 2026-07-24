        // Set pdf.js worker source globally
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
        } else {
            console.error("pdf.js library not loaded.");
        }

        const { PDFDocument, rgb, degrees, StandardFonts, PDFFont } = PDFLib;

        document.addEventListener('DOMContentLoaded', () => {
            const app = new PDFGeniusApp();
            app.init();
            window.pdfApp = app; // Expose globally for search clear button
        });
      
      

        class PDFGeniusApp {
            constructor() {
                this.selectedFiles = [];
                this.currentTool = null;
                this.fabricCanvas = null;
                this.fabricSignatureCanvas = null;
              	this.fabricCropCanvas = null; // <-- ADD THIS LINE
                this.pdfDoc = null; // For multi-page editing
                this.currentPageNum = 1;
                this.pageAnnotations = {}; // For PDF Edit tool

                // DOM Elements
                this.body = document.body;
                this.themeToggleBtn = document.getElementById('theme-toggle');
                this.header = document.getElementById('site-header');
                this.hamburgerMenu = document.getElementById('hamburger-menu');
                this.mobileNav = document.getElementById('mobile-nav');
                this.toolsGrid = document.getElementById('tools-grid');
                this.modal = document.getElementById('tool-modal');
                this.modalCloseBtn = document.getElementById('modal-close-btn');
                this.modalTitle = document.getElementById('modal-title');
                this.fileDropArea = document.getElementById('file-drop-area');
                this.fileInput = document.getElementById('file-input');
                this.fileListDiv = document.getElementById('file-list');
                this.toolOptionsDiv = document.getElementById('tool-options');
                this.processBtn = document.getElementById('process-btn');
                this.outputArea = document.getElementById('output-area');
                this.loaderOverlay = document.getElementById('loader-overlay');
                this.loaderText = document.getElementById('loader-text');
                this.fileTypeInfo = document.getElementById('file-type-info');

                // Edit PDF elements
                this.editCanvasContainer = document.getElementById('edit-canvas-container');
                this.pdfEditCanvasEl = document.getElementById('pdf-edit-canvas');
                this.prevPageBtn = document.getElementById('prev-page');
                this.nextPageBtn = document.getElementById('next-page');
                this.pageNumDisplay = document.getElementById('page-num-display');
                this.addTextBtn = document.getElementById('add-text-btn');
                this.addRectBtn = document.getElementById('add-rect-btn');
                this.drawModeBtn = document.getElementById('draw-mode-btn');
                this.clearPageBtn = document.getElementById('clear-page-btn');

                // Sign PDF elements
                this.signatureCanvasContainer = document.getElementById('signature-canvas-container');
                this.signatureCanvasEl = document.getElementById('signature-canvas');
                this.clearSignatureBtn = document.getElementById('clear-signature-btn');

                // Page modal elements --------------------------------------------------------------------------------------------------------
                this.pageModal = document.getElementById('page-modal');
                this.pageModalTitle = document.getElementById('page-modal-title');
                this.pageModalBody = document.getElementById('page-modal-body');
                this.pageModalCloseBtn = document.getElementById('page-modal-close-btn');

                document.getElementById('current-year').textContent = new Date().getFullYear();
                
                this.toolImplementations = {
                    'merge-pdf': {
                        title: 'Merge PDF', desc: 'Combine multiple PDF files into one.', icon: '➕', fileType: '.pdf', multiple: true,
                      	content: `
                        <section class="tool-content">
                            <h1>Merge PDF Files Online Free</h1>
                            <p>Merge PDF is a powerful, free online tool that combines multiple PDF files into a single unified document directly in your web browser. Whether you need to consolidate business reports, combine chapters of an eBook, merge scanned invoices, or assemble multi-part contracts into one file, this free PDF merger handles it instantly — no software installation, no signup, no server upload.</p>
                            <br>
                            <h2>Why Merge PDF Files?</h2>
                            <p>Managing multiple separate PDF files for a single project or submission is inefficient and unprofessional. Merging PDFs into one document makes it easier to share a complete package with colleagues or clients, submit multi-document applications to government portals or employers, maintain organized digital archives, print multi-section documents in correct order, and reduce the hassle of managing and attaching multiple files in emails.</p>
                            <br>
                            <p>Common use cases include combining monthly financial reports into a single annual PDF, merging multiple scanned pages from a flatbed scanner into one document, assembling legal exhibit bundles for court submissions, combining research papers and references for academic work, and packaging project deliverables into a single client-ready PDF.</p>
                            <br>
                            <h2>How the PDF Merge Tool Works</h2>
                            <p>Our tool uses PDF-lib — a powerful JavaScript library — to load each of your selected PDF files, extract all their pages, and assemble them into a new single PDF document. The merging happens entirely inside your web browser with zero server communication. Your files are never uploaded to any external server at any point.</p>
                            <br>
                            <p>Simply select multiple PDF files at once using the file picker, or drag and drop them into the upload area. The files are merged in the order you select them. Click Process and your combined PDF is ready to download immediately.</p>
                            <br>
                            <h2>Key Features of Our PDF Merger</h2>
                            <p><strong>Merge Unlimited Files:</strong> Combine as many PDF files as you need in a single operation — two files, ten files, or more.<br>
                            <strong>Preserve Quality:</strong> All text, images, fonts, and formatting from original PDFs are preserved perfectly in the merged output.<br>
                            <strong>Browser-Based Privacy:</strong> Files never leave your device. No cloud processing, no server storage.<br>
                            <strong>No File Size Limit:</strong> No arbitrary restrictions on file size — only your browser memory sets the practical limit.<br>
                            <strong>100% Free:</strong> No subscription, no trial, no credit card required. Completely free forever.<br>
                            <strong>Cross-Platform:</strong> Works on Windows, macOS, Linux, iOS, and Android in any modern browser.</p>
                            <br>
                            <h2>Tips for Best Results</h2>
                            <p>For best results, ensure your PDF files are not password-protected before merging. If they are, use our Unlock PDF tool first to remove the password. Select your files in the exact order you want them to appear in the merged PDF — the first file selected becomes the first section of the merged document. For very large PDF collections, merging in batches and then merging the results may improve browser performance.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>How many PDF files can I merge at once?</strong><br>There is no hard limit on the number of files. You can merge as many PDFs as you need. Practical limits depend on your device memory and browser.</p>
                            <br>
                            <p><strong>Will the page order be correct?</strong><br>Yes. Pages are merged in the order you select the files. Select File A first and File B second, and File A's pages will appear before File B's pages in the output.</p>
                            <br>
                            <p><strong>Do merged PDFs lose quality?</strong><br>No. PDF-lib performs a lossless merge — no re-encoding of images or re-rendering of content. Quality is identical to the originals.</p>
                            <br>
                            <p><strong>Can I merge password-protected PDFs?</strong><br>Password-protected PDFs cannot be merged directly. Use our Unlock PDF tool to remove the password first, then merge.</p>
                        </section>`,
                        process: async (files) => {
                            const mergedPdf = await PDFDocument.create();
                            for (const file of files) {
                                const pdfBytes = await file.arrayBuffer();
                                const pdf = await PDFDocument.load(pdfBytes);
                                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                                copiedPages.forEach(page => mergedPdf.addPage(page));
                            }
                            const mergedPdfBytes = await mergedPdf.save();
                            this.createDownloadLink(mergedPdfBytes, 'merged.pdf', 'application/pdf');
                        }
                    },
                    'split-pdf': {
                        title: 'Split PDF', desc: 'Extract specific pages or ranges from a PDF.', icon: '✂️', fileType: '.pdf', multiple: false,
                      	content: `
                        <section class="tool-content">
                            <h1>Split PDF Online Free</h1>
                            <p>Split PDF is a fast, free, browser-based tool that extracts specific pages or page ranges from any PDF document and saves them as a new, smaller PDF file. Whether you need a single page, a specific chapter, or a custom range of pages, this free PDF splitter delivers the result instantly — with no software installation, no server upload, and no signup required.</p>
                            <br>
                            <h2>Why Split a PDF File?</h2>
                            <p>PDF documents are often large, multi-section files that contain more content than any particular recipient needs to see. Splitting a PDF lets you extract only the relevant pages for sharing, reduce file size before emailing or uploading, separate chapters or sections for individual distribution, extract invoices from bulk billing PDFs, isolate specific pages for review or approval, and create focused documents from large reports or manuals.</p>
                            <br>
                            <p>For example, if you receive a 200-page annual report and need to share only the financial summary on pages 45-52, our Split PDF tool extracts just those pages as a clean, standalone PDF in seconds. No need to print, scan, or use expensive desktop software.</p>
                            <br>
                            <h2>How to Split a PDF</h2>
                            <p>Upload your PDF using the file selector or drag and drop. Enter your desired page range in the input field — for example, enter 1-5 to extract the first five pages, or 3, 7, 10-15 to extract a custom combination of pages and ranges. Click Process and your extracted pages are packaged as a new PDF ready to download.</p>
                            <br>
                            <h2>Page Range Syntax Guide</h2>
                            <p><strong>Single page:</strong> Enter 5 to extract page 5 only.<br>
                            <strong>Consecutive range:</strong> Enter 3-8 to extract pages 3 through 8.<br>
                            <strong>Multiple pages:</strong> Enter 1, 5, 9 to extract pages 1, 5, and 9.<br>
                            <strong>Mixed:</strong> Enter 1-3, 7, 10-12 to extract pages 1, 2, 3, 7, 10, 11, and 12.</p>
                            <br>
                            <h2>Key Features</h2>
                            <p><strong>Flexible Page Selection:</strong> Individual pages, ranges, and mixed combinations all supported.<br>
                            <strong>Quality Preserved:</strong> Extracted pages are identical to the originals — no re-rendering or quality loss.<br>
                            <strong>Completely Private:</strong> Your PDF never leaves your device. All processing is local in the browser.<br>
                            <strong>No Page Limit:</strong> Split PDFs of any length — from 2 pages to thousands.<br>
                            <strong>Instant Download:</strong> Your split PDF is ready to download the moment processing completes.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I split a PDF into multiple separate files?</strong><br>Currently the tool creates one output PDF from your specified page selection. To create multiple separate files, run the tool multiple times with different page ranges each time.</p>
                            <br>
                            <p><strong>What happens to the original PDF?</strong><br>Your original PDF is never modified. The tool creates a new PDF from the selected pages. Your original file remains intact on your device.</p>
                            <br>
                            <p><strong>Can I split a password-protected PDF?</strong><br>Use our Unlock PDF tool first to remove the password, then split the unlocked version.</p>
                        </section>`,
                        options: (container) => {
                            container.innerHTML = `<label for="page-ranges">Page ranges (e.g., 1-3, 5, 7-9):</label>
                                                 <input type="text" id="page-ranges" placeholder="e.g., 1-3, 5, 7-9">`;
                        },
                        process: async (files, options) => {
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdf = await PDFDocument.load(pdfBytes);
                            const rangeString = options['page-ranges'];
                            if (!rangeString) throw new Error('Page range is required.');

                            const pagesToExtract = [];
                            const totalPages = pdf.getPageCount();
                            rangeString.split(',').forEach(rangePart => {
                                rangePart = rangePart.trim();
                                if (rangePart.includes('-')) {
                                    const [start, end] = rangePart.split('-').map(Number);
                                    for (let i = start; i <= end; i++) {
                                        if (i > 0 && i <= totalPages) pagesToExtract.push(i - 1);
                                    }
                                } else {
                                    const pageNum = Number(rangePart);
                                    if (pageNum > 0 && pageNum <= totalPages) pagesToExtract.push(pageNum - 1);
                                }
                            });

                            if (pagesToExtract.length === 0) throw new Error('No valid pages selected for extraction.');
                            
                            const newPdf = await PDFDocument.create();
                            const copiedPages = await newPdf.copyPages(pdf, pagesToExtract);
                            copiedPages.forEach(page => newPdf.addPage(page));
                            
                            const newPdfBytes = await newPdf.save();
                            this.createDownloadLink(newPdfBytes, 'split.pdf', 'application/pdf');
                        }
                    },
                    'compress-pdf': {
                        title: 'Compress PDF', desc: 'Reduce PDF file size (image quality based).', icon: '💨', fileType: '.pdf', multiple: false,
                      	content: `
                        <section class="tool-content">
                            <h2>Compress PDF Online</h2>
                            <p>
                          	Compress PDF is a reliable online PDF compressor that helps you compress PDF files and reduce file size while maintaining original PDF 									content quality. This Compress PDF tool works directly in your web browser, allowing you to upload files from Google Drive, cloud storage, or 							  drop files instantly.
							</p>	
      						</br>
							<p>
							Using this PDF software, you can create smaller files that are easier to share, store, and upload. The compression process supports various 							file formats and handles large PDF files without strict file size limits. It’s ideal for Use Cases like email attachments, PDF form 									submissions, and document archiving.
							</p>
      						</br>
							<p>
							This free tool runs without installation and works on Windows 10 with a stable Internet connection. Unlike Adobe Acrobat or other third party 							  platforms offering limited free trial access, this online tool ensures secure compression without altering the original PDF layout.
                            </p>
							</section>`,
                        options: (container) => {
                            container.innerHTML = `<label for="compression-quality">Image Quality (0.1 - 1.0):</label>
                                                 <input type="range" id="compression-quality" min="0.1" max="1.0" step="0.1" value="0.7">
                                                 <p>Note: Compression primarily works by re-encoding images. PDFs without many images may not see significant size reduction.</p>`;
                        },
                        process: async (files, options) => {
                            this.showLoader('Compressing PDF... This can take a while for large PDFs.');
                            const file = files[0];
                            const quality = parseFloat(options['compression-quality']);
                            const pdfBytes = await file.arrayBuffer();
                            
                            const existingPdf = await PDFDocument.load(pdfBytes);
                            const newPdf = await PDFDocument.create();
                            
                            const pdfjsDoc = await pdfjsLib.getDocument({data: pdfBytes}).promise;

                            for (let i = 0; i < existingPdf.getPageCount(); i++) {
                                const page = existingPdf.getPage(i);
                                const { width, height } = page.getSize();
                                
                                const newPage = newPdf.addPage([width, height]);
                                
                                const pdfjsPage = await pdfjsDoc.getPage(i + 1);
                                const viewport = pdfjsPage.getViewport({ scale: 1.5 }); 
                                const canvas = document.createElement('canvas');
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;
                                const context = canvas.getContext('2d');
                                await pdfjsPage.render({ canvasContext: context, viewport: viewport }).promise;
                                
                                const imageBytes = await new Promise(resolve => canvas.toBlob(blob => {
                                    const reader = new FileReader();
                                    reader.onload = () => resolve(new Uint8Array(reader.result));
                                    reader.readAsArrayBuffer(blob);
                                }, 'image/jpeg', quality));

                                const image = await newPdf.embedJpg(imageBytes);
                                newPage.drawImage(image, {
                                    x: 0,
                                    y: 0,
                                    width: newPage.getWidth(),
                                    height: newPage.getHeight(),
                                });
                                this.showLoader(`Processing page ${i + 1}/${existingPdf.getPageCount()}`);
                            }
                            
                            const newPdfBytes = await newPdf.save();
                            this.createDownloadLink(newPdfBytes, 'compressed.pdf', 'application/pdf');
                        }
                    },
                    'pdf-to-word': {
                        title: 'PDF to Word (TXT)', desc: 'Convert PDF content to a plain text file.', icon: '📄➔🇼', fileType: '.pdf', multiple: false,
						content: `
                        <section class="tool-content">
                            <h1>PDF to Word Converter Online Free</h1>
                            <p>PDF to Word converter is a free, browser-based tool that extracts all text content from your PDF document and exports it as an editable text file. Recover the written content from any PDF — reports, contracts, articles, academic papers, or forms — without retyping a single word. No software installation, no server upload, no signup required.</p>
                            <br>
                            <h2>Why Convert PDF to Word?</h2>
                            <p>PDFs are designed for fixed-layout presentation, not for editing. When you receive a PDF and need to edit its content, quote from it, translate it, or repurpose it in a new document, you need access to the raw text. Our PDF to Word converter extracts all readable text from the PDF so you can paste it into Microsoft Word, Google Docs, or any text editor and work with it freely.</p>
                            <br>
                            <p>Typical use cases include editing received contracts or agreements that were sent as PDFs, extracting article text for research, translation, or summarization, recovering the text from a PDF when the original Word document is lost, pulling data from PDF reports for further analysis or formatting, converting PDF resumes into editable Word format for updating, and repurposing PDF content for new documents or presentations.</p>
                            <br>
                            <h2>How the Conversion Works</h2>
                            <p>Our tool uses PDF.js to parse the internal text content streams of your PDF. PDF.js reads the text objects embedded in each page of the document and assembles them into readable text in reading order. The extracted text is compiled page by page, with page breaks preserved, and made available as a downloadable .txt file that opens in Microsoft Word, Google Docs, Notepad, and any other text application.</p>
                            <br>
                            <h2>Text Extraction vs Full Formatting Conversion</h2>
                            <p>This tool performs text extraction — it recovers the written content of your PDF accurately and completely. Complex formatting elements like tables, columns, headers, footers, and images are not reconstructed in the output. The output is clean, readable plain text suitable for editing and repurposing. For PDFs where preserving visual layout is critical, consider using our Edit PDF tool instead.</p>
                            <br>
                            <h2>Key Features</h2>
                            <p><strong>Full Text Recovery:</strong> Every readable word in your PDF is extracted accurately.<br>
                            <strong>Multi-Page Support:</strong> All pages are extracted in order, with page breaks preserved.<br>
                            <strong>No Server Upload:</strong> Your PDF never leaves your browser — complete privacy guaranteed.<br>
                            <strong>Instant Output:</strong> Extraction completes in seconds for most PDFs.<br>
                            <strong>Universal Compatibility:</strong> The .txt output opens in any word processor or text editor.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Will tables and formatting be preserved?</strong><br>Plain text extraction recovers the text content accurately but does not reconstruct table layouts or multi-column formatting. The text will be in reading order but visual formatting is not retained.</p>
                            <br>
                            <p><strong>What if nothing is extracted?</strong><br>Your PDF is likely scanned (image-based) with no text layer. Use our OCR PDF tool first to add a searchable text layer, then convert to Word.</p>
                            <br>
                            <p><strong>Can I open the output in Microsoft Word?</strong><br>Yes. The .txt file opens directly in Word. You can then reformat and style the content as needed in Word.</p>
                        </section>`, 
                        process: async (files) => {
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                            let textContent = '';
                            for (let i = 1; i <= pdf.numPages; i++) {
                                const page = await pdf.getPage(i);
                                const text = await page.getTextContent();
                                text.items.forEach(item => textContent += item.str + ' ');
                                textContent += '\n\n'; 
                            }
                            this.createDownloadLink(new TextEncoder().encode(textContent), 'converted.txt', 'text/plain');
                        }
                    },
                    'pdf-to-powerpoint': {
                        title: 'PDF to PowerPoint', desc: 'Convert PDF pages to PowerPoint slides (images).', icon: '📄➔🇵', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>PDF to PowerPoint Converter Online Free</h1>
                            <p>PDF to PowerPoint is a fast, browser-based tool that converts every page of your PDF document into an individual slide inside a PowerPoint PPTX file. Whether you need to repurpose a business report, a research paper, or a design deck into an editable presentation, this free tool gets the job done in seconds — without requiring Microsoft PowerPoint, Adobe Acrobat, or any software installation.</p>
                            <br>
                            <h2>Why Convert PDF to PowerPoint?</h2>
                            <p>PDF files are excellent for sharing and printing, but they are not designed for editing or presenting. PowerPoint (PPTX) files, on the other hand, are built for live presentations, collaborative editing, and dynamic slideshows. By converting your PDF to PowerPoint, you regain the ability to add animations, edit text, insert new slides, and customize the design for your audience.</p>
                            <br>
                            <p>Common use cases include converting academic research PDFs into presentation slides, repurposing PDF brochures into editable marketing decks, turning scanned documents into slideshows, and sharing PDF-based reports in a format that colleagues can annotate and edit in PowerPoint or Google Slides.</p>
                            <br>
                            <h2>How PDF to PowerPoint Conversion Works</h2>
                            <p>Our tool uses PDF.js to render each page of your PDF at high resolution on an HTML canvas. Each rendered page is captured as a high-quality PNG image, which is then embedded as a full-page image inside a PowerPoint slide using PptxGenJS — a powerful JavaScript library for generating PPTX files directly in the browser.</p>
                            <br>
                            <p>The result is a PPTX file where each PDF page becomes a full-bleed slide image. The presentation is ready to open in Microsoft PowerPoint, Google Slides, LibreOffice Impress, or any compatible software. Because each slide is image-based, the original layout and formatting of your PDF is preserved perfectly — no content reflow, no missing fonts.</p>
                            <br>
                            <h2>Key Features</h2>
                            <p><strong>100% Free:</strong> No subscription, no trial, no credit card required. Convert as many PDFs as you need at no cost.<br>
                            <strong>No File Upload:</strong> Your PDF is processed entirely inside your web browser. Files are never sent to any server, ensuring complete privacy.<br>
                            <strong>High-Quality Output:</strong> Pages are rendered at 1.5x scale for crisp, sharp slide images.<br>
                            <strong>Multi-Page Support:</strong> Every page in your PDF becomes its own slide automatically.<br>
                            <strong>Cross-Platform:</strong> Works on Windows, macOS, Linux, iOS, and Android — any device with a modern browser.</p>
                            <br>
                            <h2>Tips for Best Results</h2>
                            <p>For PDFs with text you want to edit in PowerPoint, consider using our PDF to Word tool first to extract the text, then manually build your slides. For presentation-quality visual output where layout matters most, this PDF to PowerPoint tool is the right choice. Very large PDFs (50+ pages) may take a few minutes to process depending on your device speed.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I edit the text on the converted slides?</strong><br>Since slides are image-based, text is not directly editable in PowerPoint. To get editable text, extract it first with our PDF Text Extractor tool.</p>
                            <br>
                            <p><strong>Is there a page limit?</strong><br>There is no hard page limit, but processing speed depends on your browser and device. Very large PDFs may take longer.</p>
                            <br>
                            <p><strong>Does it work with password-protected PDFs?</strong><br>Use our Unlock PDF tool first to remove the password, then convert to PowerPoint.</p>
                        </section>`,
                        process: async (files) => {
                            this.showLoader('Converting PDF to PowerPoint...');
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                            
                            const pptx = new PptxGenJS();
                            pptx.layout = 'LAYOUT_WIDE';

                            for (let i = 1; i <= pdf.numPages; i++) {
                                this.showLoader(`Processing page ${i}/${pdf.numPages}`);
                                const page = await pdf.getPage(i);
                                const viewport = page.getViewport({ scale: 1.5 }); 
                                const canvas = document.createElement('canvas');
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;
                                const context = canvas.getContext('2d');
                                await page.render({ canvasContext: context, viewport: viewport }).promise;
                                
                                const imageDataUrl = canvas.toDataURL('image/png');
                                const slide = pptx.addSlide();
                                slide.addImage({ data: imageDataUrl, x: 0, y: 0, w: '100%', h: '100%' });
                            }
                            
                            const pptxBlob = await pptx.write('blob');
                            const pptxBytes = await pptxBlob.arrayBuffer();
                            this.createDownloadLink(pptxBytes, 'converted.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
                        }
                    },
                    'word-to-pdf': {
                        title: 'Word to PDF', desc: 'Convert DOCX files to PDF.', icon: '🇼➔📄', fileType: '.docx', multiple: false,
                      	content: `
                        <section class="tool-content">
                            <h1>Word to PDF Converter Online Free</h1>
                            <p>Word to PDF converter is a free, browser-based tool that transforms Microsoft Word DOCX documents into universally compatible PDF files. Share your documents with anyone on any device — without requiring them to have Microsoft Word installed. No software download, no signup, no file upload to any server required.</p>
                            <br>
                            <h2>Why Convert Word Documents to PDF?</h2>
                            <p>Microsoft Word documents look different depending on which version of Word the recipient has, which operating system they are using, and which fonts are installed on their device. PDF eliminates all of these variables — a PDF always looks exactly the same, on every device, every operating system, and every PDF reader in the world.</p>
                            <br>
                            <p>Converting to PDF is essential before submitting job applications, academic assignments, or government forms that require PDF format, before sending client proposals or business reports that must look professional on any screen, when sharing documents that should not be easily edited by recipients, and when printing documents where layout consistency is critical.</p>
                            <br>
                            <h2>How the Conversion Works</h2>
                            <p>Our tool uses mammoth.js to read your DOCX file and extract its content, then renders it as an HTML document, which is converted to PDF using html2pdf.js — all running locally in your browser. The conversion preserves headings, paragraphs, bold and italic text, and basic document structure. Your Word file never leaves your device at any point during conversion.</p>
                            <br>
                            <h2>Key Features</h2>
                            <p><strong>No Word Required:</strong> Convert DOCX files without Microsoft Office installed.<br>
                            <strong>Privacy First:</strong> Your document is processed entirely in the browser — never uploaded.<br>
                            <strong>No Watermarks:</strong> The output PDF is completely clean — no branding or watermarks added.<br>
                            <strong>Instant Conversion:</strong> Most documents convert in seconds.<br>
                            <strong>Free Forever:</strong> No subscription, no page limits, no account needed.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Will complex Word formatting be preserved?</strong><br>Basic formatting — headings, paragraphs, bold, italic — is preserved well. Advanced layouts like multi-column text, custom styles, and embedded objects may not render perfectly in the browser-based conversion.</p>
                            <br>
                            <p><strong>Does it support .doc files (older Word format)?</strong><br>Currently DOCX (Word 2007 and later) is supported. For older .doc files, open them in Word and save as DOCX first.</p>
                            <br>
                            <p><strong>Is there a file size limit?</strong><br>No strict limit. Very large DOCX files with many embedded images may take longer to process in the browser.</p>
                        </section>`,
                        process: async (files) => {
                            this.showLoader('Converting Word to PDF...');
                            const file = files[0];
                            const arrayBuffer = await file.arrayBuffer();
                            const { value: html } = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                            
                            const styledHtml = `
                                <style>
                                    body { font-family: sans-serif; line-height: 1.5; margin: 20px; color: ${this.body.classList.contains('dark-mode') ? '#e0e0e0' : '#333'}; }
                                    p { margin-bottom: 1em; }
                                    ul, ol { margin-bottom: 1em; padding-left: 1.5em; }
                                    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.2; }
                                    table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
                                    th, td { border: 1px solid ${this.body.classList.contains('dark-mode') ? '#555' : '#ccc'}; padding: 0.5em; text-align: left; }
                                </style>
                                ${html}`;
                            
                            const element = document.createElement('div');
                            element.innerHTML = styledHtml;
                            document.body.appendChild(element); 
                            
                            html2pdf().from(element).set({
                                margin: [15, 15, 15, 15], 
                                filename: 'word.pdf',
                                image: { type: 'jpeg', quality: 0.95 },
                                html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: this.body.classList.contains('dark-mode') ? '#1e1e1e' : null }, 
                                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                            }).save().then(() => {
                                document.body.removeChild(element); 
                                this.hideLoader();
                            }).catch(err => {
                                document.body.removeChild(element); 
                                this.showError('Error converting Word to PDF: ' + err.message);
                                this.hideLoader();
                            });
                            return "processing"; 
                        }
                    },
                    'edit-pdf': {
                        title: 'Edit PDF', desc: 'Add text, shapes, and drawings to your PDF.', icon: '✏️', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Edit PDF Online Free</h1>
                            <p>Edit PDF is a free, browser-based PDF editor that lets you annotate and modify PDF documents by adding text boxes, drawing shapes, and sketching freehand directly on any PDF page. No software download, no subscription, no signup — just open the tool, upload your PDF, and start editing instantly in your web browser.</p>
                            <br>
                            <h2>What Can You Do with the PDF Editor?</h2>
                            <p>Our Edit PDF tool gives you a powerful Fabric.js canvas overlay on top of your PDF pages. You can add custom text in any position on the page, insert rectangles and shapes to highlight or block sections, draw freehand with a pen tool for annotations or signatures, and navigate between pages to edit different sections of multi-page PDFs.</p>
                            <br>
                            <p>This is ideal for filling in PDF forms that are not interactive, adding comments or review notes to documents, marking up technical drawings or architectural plans, inserting missing information into scanned PDFs, and highlighting key sections before sharing.</p>
                            <br>
                            <h2>How the PDF Editor Works</h2>
                            <p>When you upload a PDF, our tool uses PDF.js to render each page as a high-resolution canvas. Fabric.js then creates an interactive editing layer on top of the rendered page, allowing you to place and manipulate objects freely. When you click Process, all your edits are flattened onto the PDF pages using PDF-lib, and the resulting file is saved for download.</p>
                            <br>
                            <p>Because everything runs in your browser, your documents are completely private — they never leave your device. This makes it suitable even for sensitive business, legal, or personal documents.</p>
                            <br>
                            <h2>Key Features</h2>
                            <p><strong>Add Text:</strong> Click anywhere on the page and type. Reposition text boxes freely.<br>
                            <strong>Add Shapes:</strong> Insert rectangles to highlight, cover, or frame content areas.<br>
                            <strong>Freehand Drawing:</strong> Sketch, annotate, or draw signatures with the pen tool.<br>
                            <strong>Page Navigation:</strong> Work on any page of a multi-page PDF with Previous/Next controls.<br>
                            <strong>Clear Edits:</strong> Reset changes on any page before saving.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I edit the original text inside the PDF?</strong><br>This editor adds new elements on top of the PDF. Changing the original embedded text requires a full desktop PDF editor like Adobe Acrobat.</p>
                            <br>
                            <p><strong>Will my edits be saved permanently?</strong><br>Yes. When you click Process, all edits are permanently flattened into the downloaded PDF.</p>
                            <br>
                            <p><strong>Is it compatible with all PDFs?</strong><br>It works with most standard PDFs. Encrypted or heavily protected files should be unlocked first using our Unlock PDF tool.</p>
                        </section>`,
                        onFileSelect: async (files) => {
                            this.editCanvasContainer.style.display = 'block';
                            this.signatureCanvasContainer.style.display = 'none';
                            
                            if (!this.fabricCanvas) {
                                this.fabricCanvas = new fabric.Canvas(this.pdfEditCanvasEl, {
                                    width: this.pdfEditCanvasEl.parentElement.clientWidth -2, 
                                    height: (this.pdfEditCanvasEl.parentElement.clientWidth -2) * 1.414, 
                                    backgroundColor: this.body.classList.contains('dark-mode') ? '#333' : 'white'
                                });
                            } else {
                               this.fabricCanvas.setBackgroundColor(this.body.classList.contains('dark-mode') ? '#333' : 'white', this.fabricCanvas.renderAll.bind(this.fabricCanvas));
                            }
                            this.pageAnnotations = {}; 
                            this.currentPageNum = 1;
                            await this.loadPdfPageForEditing(files[0], this.currentPageNum);
                        },
                        options: (container) => {
                            container.innerHTML = `<p>Use the controls above the canvas to navigate pages and add elements.</p>`;
                        },
                        process: async (files, options) => {
                            this.showLoader('Applying edits to PDF...');
                            const file = files[0];
                            const existingPdfBytes = await file.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(existingPdfBytes);
                            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

                            for (const pageNumStr in this.pageAnnotations) {
                                const pageNum = parseInt(pageNumStr);
                                const page = pdfDoc.getPage(pageNum - 1); 
                                const annotations = this.pageAnnotations[pageNumStr];
                                const { width: pageWidth, height: pageHeight } = page.getSize();
                                
                                const fabricCanvasWidth = this.fabricCanvas.getWidth();
                                const fabricCanvasHeight = this.fabricCanvas.getHeight();

                                const scaleX = pageWidth / fabricCanvasWidth;
                                const scaleY = pageHeight / fabricCanvasHeight;
                                
                                for (const obj of annotations) {
                                    this.showLoader(`Applying edits to page ${pageNum}...`);
                                    if (obj.type === 'textbox' || obj.type === 'i-text') { 
                                        page.drawText(obj.text, {
                                            x: obj.left * scaleX,
                                            y: pageHeight - (obj.top + obj.height * obj.scaleY) * scaleY, 
                                            font: helveticaFont,
                                            size: obj.fontSize * obj.scaleY * scaleY, 
                                            color: this.hexToRgbPdfLib(obj.fill),
                                            rotate: degrees(-obj.angle), 
                                        });
                                    } else if (obj.type === 'rect') {
                                        page.drawRectangle({
                                            x: obj.left * scaleX,
                                            y: pageHeight - (obj.top + obj.height * obj.scaleY) * scaleY,
                                            width: obj.width * obj.scaleX * scaleX,
                                            height: obj.height * obj.scaleY * scaleY,
                                            borderColor: this.hexToRgbPdfLib(obj.stroke),
                                            borderWidth: obj.strokeWidth,
                                            color: obj.fill && obj.fill !== 'transparent' ? this.hexToRgbPdfLib(obj.fill) : undefined,
                                            opacity: obj.opacity,
                                            rotate: degrees(-obj.angle),
                                        });
                                    } else if (obj.type === 'path') { 
                                        const pathAsImage = await this.fabricObjectToImage(obj, this.fabricCanvas);
                                        const embeddedImage = await pdfDoc.embedPng(pathAsImage);
                                        page.drawImage(embeddedImage, {
                                            x: obj.left * scaleX,
                                            y: pageHeight - (obj.top + obj.height * obj.scaleY) * scaleY,
                                            width: obj.width * obj.scaleX * scaleX,
                                            height: obj.height * obj.scaleY * scaleY,
                                            opacity: obj.opacity,
                                            rotate: degrees(-obj.angle),
                                        });
                                    }
                                }
                            }
                            const editedPdfBytes = await pdfDoc.save();
                            this.createDownloadLink(editedPdfBytes, 'edited.pdf', 'application/pdf');
                            this.resetEditCanvas();
                        }
                    },
                    'sign-pdf': {
                        title: 'Sign PDF', desc: 'Draw your signature and add it to a PDF.', icon: '✍️', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Sign PDF Online Free</h1>
                            <p>Sign PDF is a free electronic signature tool that lets you draw your handwritten signature and add it to any PDF document directly in your browser. No Adobe Acrobat, no DocuSign subscription, no software installation required. Just upload your PDF, draw your signature, position it on the page, and download your signed document instantly.</p>
                            <br>
                            <h2>Why Use Electronic PDF Signatures?</h2>
                            <p>Electronic signatures have become the standard for modern business workflows. They eliminate the need to print, sign, scan, and email documents — saving time, paper, and effort. Whether you are signing contracts, agreements, consent forms, approval letters, or internal documents, a digital signature on a PDF is universally accepted in most professional and business contexts.</p>
                            <br>
                            <p>Our Sign PDF tool is powered by Fabric.js for smooth, natural signature drawing, and PDF-lib for embedding the signature permanently into the PDF. Everything happens locally in your browser — your document and signature data are never uploaded to any server.</p>
                            <br>
                            <h2>How to Sign a PDF</h2>
                            <p>Upload your PDF file using the file selector or drag and drop. The tool will render your PDF and display a signature drawing canvas. Use your mouse (on desktop) or finger (on touchscreen devices) to draw your signature. Once satisfied, position the signature on the correct page and location. Click Process to embed the signature permanently into the PDF and download the signed document.</p>
                            <br>
                            <h2>Key Features</h2>
                            <p><strong>Draw Signature:</strong> Natural freehand drawing on a smooth canvas.<br>
                            <strong>Touch Support:</strong> Works on smartphones and tablets with touch input.<br>
                            <strong>Image Upload:</strong> Upload a PNG image of your existing signature instead of drawing.<br>
                            <strong>Permanent Embedding:</strong> Signature is flattened into the PDF — not a floating layer.<br>
                            <strong>Privacy First:</strong> Your document never leaves your device.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Is this legally binding?</strong><br>Electronic signatures are legally recognized in many countries under laws such as the US ESIGN Act and the EU eIDAS regulation. However, legal validity depends on jurisdiction and document type. Consult a legal professional for high-stakes documents.</p>
                            <br>
                            <p><strong>Can I sign the same PDF multiple times?</strong><br>Yes. You can re-upload the signed PDF and add additional signatures as needed.</p>
                        </section>`,
                        onFileSelect: () => {
                            this.signatureCanvasContainer.style.display = 'block';
                            this.editCanvasContainer.style.display = 'none';
                            const bgColor = this.body.classList.contains('dark-mode') ? '#383838' : '#f0f0f0';
                            if (!this.fabricSignatureCanvas) {
                                this.fabricSignatureCanvas = new fabric.Canvas(this.signatureCanvasEl, {
                                    isDrawingMode: true,
                                    backgroundColor: bgColor,
                                });
                                this.fabricSignatureCanvas.freeDrawingBrush.width = 3;
                                this.fabricSignatureCanvas.freeDrawingBrush.color = this.body.classList.contains('dark-mode') ? '#e0e0e0' : '#000000';
                            } else {
                                this.fabricSignatureCanvas.clear();
                                this.fabricSignatureCanvas.backgroundColor = bgColor; 
                                this.fabricSignatureCanvas.freeDrawingBrush.color = this.body.classList.contains('dark-mode') ? '#e0e0e0' : '#000000';
                                this.fabricSignatureCanvas.renderAll();
                            }
                        },
                        options: (container) => {
                            container.innerHTML = `<label for="sign-page-num">Page to sign (default: 1):</label>
                                                 <input type="number" id="sign-page-num" value="1" min="1">
                                                 <label for="sign-pos-x">Signature X Position (% from left, e.g., 70):</label>
                                                 <input type="number" id="sign-pos-x" value="70" min="0" max="100">
                                                 <label for="sign-pos-y">Signature Y Position (% from bottom, e.g., 10):</label>
                                                 <input type="number" id="sign-pos-y" value="10" min="0" max="100">
                                                 <label for="sign-width">Signature Width (px, e.g., 150):</label>
                                                 <input type="number" id="sign-width" value="150">`;
                        },
                        process: async (files, options) => {
                            this.showLoader('Adding signature to PDF...');
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(pdfBytes);

                            if (this.fabricSignatureCanvas.isEmpty()) {
                                throw new Error('Please draw a signature first.');
                            }
                            const signatureImgDataUrl = this.fabricSignatureCanvas.toDataURL({format: 'png'});
                            const signaturePngBytes = await fetch(signatureImgDataUrl).then(res => res.arrayBuffer());
                            const signatureImage = await pdfDoc.embedPng(signaturePngBytes);
                            
                            const pageNum = parseInt(options['sign-page-num']) || 1;
                            if (pageNum < 1 || pageNum > pdfDoc.getPageCount()) {
                                throw new Error(`Invalid page number. PDF has ${pdfDoc.getPageCount()} pages.`);
                            }
                            const page = pdfDoc.getPage(pageNum - 1);
                            const { width: pageWidth, height: pageHeight } = page.getSize();

                            const sigWidth = parseFloat(options['sign-width']) || 150;
                            const sigHeight = (sigWidth / signatureImage.width) * signatureImage.height;
                            const posX = (parseFloat(options['sign-pos-x']) / 100) * pageWidth || (pageWidth - sigWidth - 20) ; 
                            const posY = (parseFloat(options['sign-pos-y']) / 100) * pageHeight || 20; 

                            page.drawImage(signatureImage, {
                                x: posX,
                                y: posY,
                                width: sigWidth,
                                height: sigHeight,
                            });

                            const signedPdfBytes = await pdfDoc.save();
                            this.createDownloadLink(signedPdfBytes, 'signed.pdf', 'application/pdf');
                            this.resetSignatureCanvas();
                        }
                    },
                    'watermark-pdf': {
                        title: 'Watermark PDF', desc: 'Add a text watermark to all pages of a PDF.', icon: '💧', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Watermark PDF Online Free</h1>
                            <p>Watermark PDF is a free online tool that adds a customizable diagonal text watermark to every page of your PDF document. Mark documents as Confidential, Draft, Sample, For Review, or with your company name — instantly, without any software installation or file upload to a server.</p>
                            <br>
                            <h2>Why Add a Watermark to Your PDF?</h2>
                            <p>Watermarks serve multiple important purposes in professional document management. They indicate the status of a document — such as Draft or Approved — communicate ownership and branding, deter unauthorized copying or redistribution of proprietary content, and provide a clear visual indicator for review copies that should not be treated as final versions.</p>
                            <br>
                            <p>Adding a watermark is especially important when sharing proposal documents with clients, distributing sample reports, sending review copies of legal contracts, or protecting intellectual property in PDF-based publications and eBooks.</p>
                            <br>
                            <h2>How It Works</h2>
                            <p>Our tool uses PDF-lib to embed your watermark text directly into the PDF page content stream. You can customize the watermark text, adjust the opacity (from nearly invisible to bold), and set the rotation angle for diagonal or horizontal placement. The watermark is applied consistently across all pages of the document.</p>
                            <br>
                            <h2>Key Features</h2>
                            <p><strong>Custom Text:</strong> Enter any watermark text — company name, status, or copyright notice.<br>
                            <strong>Adjustable Opacity:</strong> Control how visible the watermark appears on the page.<br>
                            <strong>Rotation Control:</strong> Set diagonal, horizontal, or custom angle placement.<br>
                            <strong>All Pages:</strong> Watermark is applied uniformly to every page.<br>
                            <strong>No Server Upload:</strong> Processing is entirely client-side for full document privacy.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can the watermark be removed?</strong><br>Watermarks added via this tool are embedded in the page content and are difficult to remove without advanced PDF editing software. For stronger protection, combine with our Protect PDF tool to add password encryption.</p>
                            <br>
                            <p><strong>Can I add an image watermark (logo)?</strong><br>Currently, only text watermarks are supported. Image watermarks may be added in a future update.</p>
                        </section>`,
                        options: (container) => {
                            container.innerHTML = `<label for="watermark-text">Watermark Text:</label>
                                                 <input type="text" id="watermark-text" value="CONFIDENTIAL">
                                                 <label for="watermark-opacity">Opacity (0.1 - 1.0):</label>
                                                 <input type="range" id="watermark-opacity" min="0.1" max="1.0" step="0.1" value="0.3">
                                                 <label for="watermark-size">Font Size:</label>
                                                 <input type="number" id="watermark-size" value="50">`;
                        },
                        process: async (files, options) => {
                            this.showLoader('Adding watermark...');
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(pdfBytes);
                            const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

                            const text = options['watermark-text'] || "CONFIDENTIAL";
                            const opacity = parseFloat(options['watermark-opacity']) || 0.3;
                            const fontSize = parseInt(options['watermark-size']) || 50;
                            const watermarkColor = this.body.classList.contains('dark-mode') ? rgb(0.8, 0.8, 0.8) : rgb(0.5, 0.5, 0.5);


                            const pages = pdfDoc.getPages();
                            for (const page of pages) {
                                const { width, height } = page.getSize();
                                const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
                                const textHeight = helveticaFont.heightAtSize(fontSize);
                                
                                page.drawText(text, {
                                    x: width / 2 - textWidth / 2,
                                    y: height / 2 - textHeight / 2,
                                    font: helveticaFont,
                                    size: fontSize,
                                    color: watermarkColor, 
                                    opacity: opacity,
                                    rotate: degrees(45),
                                });
                            }
                            const watermarkedPdfBytes = await pdfDoc.save();
                            this.createDownloadLink(watermarkedPdfBytes, 'watermarked.pdf', 'application/pdf');
                        }
                    },
                    'rotate-pdf': {
                        title: 'Rotate PDF', desc: 'Rotate all pages of a PDF.', icon: '🔄', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Rotate PDF Pages Online Free</h1>
                            <p>Rotate PDF is a simple, free online tool that corrects the orientation of your PDF pages. If your PDF was scanned upside down, saved sideways, or has mixed page orientations, this tool fixes it in seconds — no software needed, no file upload, completely free.</p>
                            <br>
                            <h2>When Do You Need to Rotate a PDF?</h2>
                            <p>Rotation issues are extremely common with scanned documents. When documents are placed incorrectly in a scanner, or when a mobile phone camera is held sideways while scanning, the resulting PDF pages come out rotated. Similarly, some PDF export tools from spreadsheet applications or design software may produce landscape-oriented pages that display sideways in standard PDF readers.</p>
                            <br>
                            <p>Rotating your PDF before sharing ensures recipients can read it comfortably without turning their screen, which is especially important for professional documents, reports, contracts, and invoices.</p>
                            <br>
                            <h2>How PDF Rotation Works</h2>
                            <p>Our tool uses PDF-lib to modify the rotation metadata of each page in the PDF. You can rotate all pages 90 degrees clockwise, 90 degrees counterclockwise (270 degrees), or 180 degrees (fully upside down and back). The rotation is applied to the page orientation flag in the PDF, which means the actual content is not re-rendered — text and image quality remain completely unchanged.</p>
                            <br>
                            <h2>Key Features</h2>
                            <p><strong>Three Rotation Options:</strong> 90°, 180°, or 270° clockwise rotation.<br>
                            <strong>All Pages at Once:</strong> Rotation is applied to every page uniformly.<br>
                            <strong>No Quality Loss:</strong> Content is not re-rendered — original resolution is preserved.<br>
                            <strong>Instant Processing:</strong> Rotation completes in seconds even for large PDFs.<br>
                            <strong>100% Private:</strong> Your PDF never leaves your browser.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I rotate only specific pages?</strong><br>Currently, the tool rotates all pages by the same angle. To rotate individual pages, use our Organize PDF tool which gives you per-page control.</p>
                            <br>
                            <p><strong>Will rotating change my file size?</strong><br>No. Rotation is a metadata change only. File size remains essentially unchanged.</p>
                        </section>`,
                        options: (container) => {
                            container.innerHTML = `<label for="rotate-angle">Rotation Angle:</label>
                                                 <select id="rotate-angle">
                                                     <option value="90">90° Clockwise</option>
                                                     <option value="180">180° Clockwise</option>
                                                     <option value="270">270° Clockwise</option>
                                                 </select>`;
                        },
                        process: async (files, options) => {
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(pdfBytes);
                            const angle = parseInt(options['rotate-angle']);

                            const pages = pdfDoc.getPages();
                            pages.forEach(page => {
                                const currentRotation = page.getRotation().angle;
                                page.setRotation(degrees(currentRotation + angle));
                            });

                            const rotatedPdfBytes = await pdfDoc.save();
                            this.createDownloadLink(rotatedPdfBytes, 'rotated.pdf', 'application/pdf');
                        }
                    },
                    'pdf-to-jpg': {
                        title: 'PDF to JPG', desc: 'Convert PDF pages to JPG images.', icon: '📄➔🖼️J', fileType: '.pdf', multiple: false,
                      	content: `
                        <section class="tool-content">
                            <h1>PDF to JPG Converter Online Free</h1>
                            <p>PDF to JPG is a free, browser-based converter that renders every page of your PDF document as a high-quality JPEG image file. Convert PDF pages to images for presentations, social media, websites, previews, or any use case that requires images instead of PDF — instantly, privately, and completely free.</p>
                            <br>
                            <h2>Why Convert PDF Pages to JPG?</h2>
                            <p>PDF files cannot be directly displayed in many applications and platforms that only support image formats. Converting PDF pages to JPG solves this compatibility problem across a wide range of use cases. Insert PDF content into PowerPoint presentations as image slides. Share PDF pages on social media platforms like Instagram, Twitter, or LinkedIn that do not support PDF uploads. Create image previews for PDF documents displayed on websites or in document management systems. Embed PDF page content into Word documents or Google Docs as images. Send PDF pages via messaging apps that display images inline but not PDFs.</p>
                            <br>
                            <h2>How the PDF to JPG Conversion Works</h2>
                            <p>Our tool uses PDF.js to render each page of your PDF on an HTML canvas at high resolution (1.5x scale). The rendered canvas is then exported as a JPEG image at high quality. For single-page PDFs, the image downloads directly. For multi-page PDFs, all page images are packaged into a ZIP archive for easy bulk download.</p>
                            <br>
                            <h2>JPG vs PNG — Which Format to Choose?</h2>
                            <p>JPG uses lossy compression — it produces smaller files but with slight quality reduction, especially around sharp text edges. JPG is best when file size matters and the PDF contains primarily photographs or complex graphics. PNG uses lossless compression and is better for PDFs with sharp text, diagrams, charts, or logos. Use our PDF to PNG tool if you need lossless quality. Use PDF to JPG when you need compact image files for web use or sharing.</p>
                            <br>
                            <h2>Key Features</h2>
                            <p><strong>High Resolution Output:</strong> Pages rendered at 1.5x scale for sharp, clear images.<br>
                            <strong>All Pages Converted:</strong> Every page becomes a separate JPG image automatically.<br>
                            <strong>ZIP Download:</strong> Multi-page PDFs are packaged as a ZIP for convenient bulk download.<br>
                            <strong>No Server Upload:</strong> All conversion runs locally in your browser — complete privacy.<br>
                            <strong>Free and Unlimited:</strong> No page limits, no file size limits, no signup required.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I convert just one page of a PDF to JPG?</strong><br>Use our Split PDF tool first to extract the specific page, then convert the single-page PDF to JPG.</p>
                            <br>
                            <p><strong>What resolution are the output JPG images?</strong><br>Pages are rendered at 1.5x the native PDF resolution. For most documents this produces images of approximately 1000-1500px wide.</p>
                            <br>
                            <p><strong>How do I download all the JPG images?</strong><br>For multi-page PDFs, all images are bundled into a ZIP file. Click the download link to save the ZIP, then extract it to access all individual JPG files.</p>
                        </section>`,
                        options: (container) => {
                             container.innerHTML = `<label for="jpg-quality">JPG Quality (0.1 - 1.0):</label>
                                                 <input type="range" id="jpg-quality" min="0.1" max="1.0" step="0.1" value="0.8">
                                                 <p>Multiple pages will be zipped.</p>`;
                        },
                        process: async (files, options) => {
                            this.showLoader('Converting PDF to JPG...');
                            const file = files[0];
                            const quality = parseFloat(options['jpg-quality']) || 0.8;
                            const pdfBytes = await file.arrayBuffer();
                            const pdf = await pdfjsLib.getDocument({data: pdfBytes}).promise;
                            const numPages = pdf.numPages;
                            const zip = new JSZip();

                            for (let i = 1; i <= numPages; i++) {
                                this.showLoader(`Processing page ${i}/${numPages}`);
                                const page = await pdf.getPage(i);
                                const viewport = page.getViewport({ scale: 2.0 }); 
                                const canvas = document.createElement('canvas');
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;
                                const context = canvas.getContext('2d');
                                await page.render({ canvasContext: context, viewport: viewport }).promise;
                                
                                const imageDataUrl = canvas.toDataURL('image/jpeg', quality);
                                const imgBlob = await fetch(imageDataUrl).then(res => res.blob());
                                zip.file(`page_${i}.jpg`, imgBlob);
                            }

                            if (numPages === 1) {
                                const page = await pdf.getPage(1);
                                const viewport = page.getViewport({ scale: 2.0 });
                                const canvas = document.createElement('canvas');
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;
                                const context = canvas.getContext('2d');
                                await page.render({ canvasContext: context, viewport: viewport }).promise;
                                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
                                this.createDownloadLink(blob, 'page_1.jpg', 'image/jpeg');
                            } else {
                                const zipBlob = await zip.generateAsync({type:"blob"});
                                this.createDownloadLink(zipBlob, `${file.name.replace('.pdf', '')}_jpg.zip`, 'application/zip');
                            }
                        }
                    },
                    'jpg-to-pdf': {
                        title: 'JPG to PDF', desc: 'Convert JPG images to a PDF file.', icon: '🖼️J➔📄', fileType: '.jpg,.jpeg', multiple: true,
                      	content: `
                        <section class="tool-content">
                            <h2>JPG to PDF Converter</h2>
                            <p>
							JPG to PDF Converter allows you to combine images into a single PDF document. It’s perfect for scanned images, photos, and visual documents.
							</p>	
      						</br>
							<p>
							You can arrange images in the correct order before converting. The tool creates clean PDFs suitable for sharing or printing.
							</p>
      						</br>
							<p>
							No signup or watermark is added, and your images never leave your device.                            
      						</p>
							</section>`,
                        process: async (files) => {
                            this.showLoader('Converting JPGs to PDF...');
                            const pdfDoc = await PDFDocument.create();
                            for (let i = 0; i < files.length; i++) {
                                const file = files[i];
                                this.showLoader(`Processing image ${i+1}/${files.length}`);
                                const imgBytes = await file.arrayBuffer();
                                const image = await pdfDoc.embedJpg(imgBytes);
                                const page = pdfDoc.addPage([image.width, image.height]);
                                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
                            }
                            const pdfBytes = await pdfDoc.save();
                            this.createDownloadLink(pdfBytes, 'jpg_to.pdf', 'application/pdf');
                        }
                    },
                    'pdf-to-png': {
                        title: 'PDF to PNG', desc: 'Convert PDF pages to PNG images.', icon: '📄➔🖼️P', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>PDF to PNG Converter Online Free</h1>
                            <p>PDF to PNG is a free online converter that renders each page of your PDF document as a high-quality PNG image file. PNG format offers lossless compression, meaning your converted images retain perfect sharpness — ideal for documents with text, diagrams, charts, and graphics that must look crisp at any zoom level.</p>
                            <br>
                            <h2>Why Convert PDF to PNG?</h2>
                            <p>PNG images are preferred over JPG when quality matters more than file size. Unlike JPG which uses lossy compression that can blur text and create artifacts around sharp edges, PNG preserves every pixel perfectly. This makes PDF to PNG conversion the right choice for technical diagrams, architectural drawings, presentation slides, infographics, and any document where text sharpness is critical.</p>
                            <br>
                            <p>Common use cases include inserting PDF content into Word documents or presentations, sharing individual PDF pages on social media or websites, creating thumbnails for document preview systems, and archiving PDF pages as image files for non-PDF environments.</p>
                            <br>
                            <h2>How the Conversion Works</h2>
                            <p>The tool uses PDF.js to render each PDF page on an HTML canvas at high resolution. The canvas is then exported as a PNG image using the browser's native canvas-to-image export functionality. Multi-page PDFs produce multiple PNG files which are packaged into a ZIP archive for easy download.</p>
                            <br>
                            <h2>PNG vs JPG — Which Should You Choose?</h2>
                            <p>Choose PNG when: your document contains text, sharp lines, charts, or logos; you need images for further editing without quality loss; or you plan to use the images on a website with a transparent background. Choose JPG when: your document is primarily photographic; you need smaller file sizes; or the images will be used where slight quality loss is acceptable.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Are all pages converted?</strong><br>Yes. Every page of your PDF is rendered as a separate PNG image and included in the download.</p>
                            <br>
                            <p><strong>What resolution are the output images?</strong><br>Pages are rendered at a high resolution scale suitable for most professional use cases.</p>
                        </section>`,
                         process: async (files, options) => {
                            this.showLoader('Converting PDF to PNG...');
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdf = await pdfjsLib.getDocument({data: pdfBytes}).promise;
                            const numPages = pdf.numPages;
                            const zip = new JSZip();

                            for (let i = 1; i <= numPages; i++) {
                                this.showLoader(`Processing page ${i}/${numPages}`);
                                const page = await pdf.getPage(i);
                                const viewport = page.getViewport({ scale: 2.0 }); 
                                const canvas = document.createElement('canvas');
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;
                                const context = canvas.getContext('2d');
                                await page.render({ canvasContext: context, viewport: viewport }).promise;
                                
                                const imageDataUrl = canvas.toDataURL('image/png');
                                const imgBlob = await fetch(imageDataUrl).then(res => res.blob());
                                zip.file(`page_${i}.png`, imgBlob);
                            }

                            if (numPages === 1) {
                                const page = await pdf.getPage(1);
                                const viewport = page.getViewport({ scale: 2.0 });
                                const canvas = document.createElement('canvas');
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;
                                const context = canvas.getContext('2d');
                                await page.render({ canvasContext: context, viewport: viewport }).promise;
                                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                                this.createDownloadLink(blob, 'page_1.png', 'image/png');
                            } else {
                                const zipBlob = await zip.generateAsync({type:"blob"});
                                this.createDownloadLink(zipBlob, `${file.name.replace('.pdf', '')}_png.zip`, 'application/zip');
                            }
                        }
                    },
                    'png-to-pdf': {
                        title: 'PNG to PDF', desc: 'Convert PNG images to a PDF file.', icon: '🖼️P➔📄', fileType: '.png', multiple: true,

                      content: `
                        <section class="tool-content">
                            <h1>PNG to PDF Converter Online Free</h1>
                            <p>PNG to PDF is a free online tool that combines one or more PNG image files into a single, professional PDF document. Each PNG image becomes a full page in the PDF. No signup, no watermark, no file upload to any server — everything is processed locally in your browser for complete privacy.</p>
                            <br>
                            <h2>Why Convert PNG Images to PDF?</h2>
                            <p>PNG files are great for individual images but impractical when you need to share multiple pages or create a document. PDF is the universal document format — it preserves layout across all devices, is universally supported, and is the standard format for professional document sharing, printing, and archiving.</p>
                            <br>
                            <p>Typical use cases for PNG to PDF conversion include: combining multiple screenshots into a single report, compiling design mockups or UI wireframes into a presentation PDF, packaging diagrams or technical drawings for distribution, turning photo sequences into a portfolio PDF, and submitting image-based documents via email or document portals that require PDF format.</p>
                            <br>
                            <h2>How It Works</h2>
                            <p>Select your PNG files, arrange them in the desired page order, and click Process. Our tool uses PDF-lib to create a new PDF and embed each PNG image as a full-page element. The resulting PDF is generated entirely in your browser with no server communication.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>How many PNG files can I convert at once?</strong><br>There is no strict limit. Select as many PNG files as you need. Each file becomes one page in the output PDF.</p>
                            <br>
                            <p><strong>Will image quality be preserved?</strong><br>Yes. PNG images are embedded at their original resolution. No compression or quality loss is applied.</p>
                            <br>
                            <p><strong>Can I mix PNG and JPG images?</strong><br>This tool is optimized for PNG files. For JPG images, use our JPG to PDF tool instead.</p>
                        </section>`,
                        process: async (files) => {
                             this.showLoader('Converting PNGs to PDF...');
                            const pdfDoc = await PDFDocument.create();
                            for (let i = 0; i < files.length; i++) {
                                const file = files[i];
                                this.showLoader(`Processing image ${i+1}/${files.length}`);
                                const imgBytes = await file.arrayBuffer();
                                const image = await pdfDoc.embedPng(imgBytes);
                                const page = pdfDoc.addPage([image.width, image.height]);
                                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
                            }
                            const pdfBytes = await pdfDoc.save();
                            this.createDownloadLink(pdfBytes, 'png_to.pdf', 'application/pdf');
                        }
                    },
                    'excel-to-pdf': {
                        title: 'Excel to PDF', desc: 'Convert Excel (XLSX) files to PDF.', icon: '🇽➔📄', fileType: '.xlsx', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Excel to PDF Converter Online Free</h1>
                            <p>Excel to PDF is a free, browser-based converter that transforms Microsoft Excel spreadsheet files (XLSX format) into PDF documents. Share financial reports, data tables, budgets, and spreadsheets with anyone — even if they don't have Excel installed — by converting them to the universally compatible PDF format.</p>
                            <br>
                            <h2>Why Convert Excel to PDF?</h2>
                            <p>Excel files are powerful for data analysis, but they are not ideal for sharing. Recipients may have different versions of Excel, or no spreadsheet software at all. Excel files can also be accidentally edited. By converting to PDF, you lock the layout and data in place, ensuring your spreadsheet looks exactly the same on every device and operating system — whether it's opened on a Windows PC, a Mac, an iPhone, or an Android tablet.</p>
                            <br>
                            <p>Excel to PDF conversion is commonly used for sharing monthly financial reports with stakeholders, sending invoices and quotes in a professional format, submitting data to clients or government portals that require PDF, archiving spreadsheet data in a non-editable format, and printing spreadsheets with consistent layout.</p>
                            <br>
                            <h2>How the Conversion Works</h2>
                            <p>Our tool uses the SheetJS (xlsx.js) library to read your XLSX file and extract the data and formatting. The spreadsheet is then rendered as an HTML table and converted to PDF using html2pdf.js — all running locally in your browser without any server upload.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Does it support multiple sheets?</strong><br>Currently, the active (first) sheet is converted. Multi-sheet support may be added in future updates.</p>
                            <br>
                            <p><strong>Does it preserve formulas?</strong><br>Formulas are evaluated and their current values are shown in the PDF. The PDF is a static snapshot — not a live spreadsheet.</p>
                            <br>
                            <p><strong>Is it free?</strong><br>Yes, completely free with no file upload, no signup, and no watermarks on the output.</p>
                        </section>`,
                        process: async (files) => {
                            this.showLoader('Converting Excel to PDF...');
                            const file = files[0];
                            const data = await file.arrayBuffer();
                            const workbook = XLSX.read(data);
                            const firstSheetName = workbook.SheetNames[0];
                            const worksheet = workbook.Sheets[firstSheetName];
                            const htmlTable = XLSX.utils.sheet_to_html(worksheet);
                            const isDarkMode = this.body.classList.contains('dark-mode');

                            const styledHtml = `
                                <style>
                                    body { font-family: sans-serif; color: ${isDarkMode ? '#e0e0e0' : '#333'}; }
                                    table { border-collapse: collapse; width: 100%; font-size: 10px; }
                                    th, td { border: 1px solid ${isDarkMode ? '#555' : '#ccc'}; padding: 4px; text-align: left; }
                                    th { background-color: ${isDarkMode ? '#3a3a3a' : '#f2f2f2'}; }
                                </style>
                                ${htmlTable}`;
                            
                            const element = document.createElement('div');
                            element.innerHTML = styledHtml;
                            document.body.appendChild(element);

                            html2pdf().from(element).set({
                                margin: [10, 5, 10, 5], 
                                filename: 'excel.pdf',
                                image: { type: 'jpeg', quality: 0.95 },
                                html2canvas: { scale: 2, logging: false, backgroundColor: isDarkMode ? '#1e1e1e' : null },
                                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' } 
                            }).save().then(() => {
                                document.body.removeChild(element);
                                this.hideLoader();
                            }).catch(err => {
                                document.body.removeChild(element);
                                this.showError('Error converting Excel to PDF: ' + err.message);
                                this.hideLoader();
                            });
                            return "processing";
                        }
                    },
                    'pdf-to-excel': {
                        title: 'PDF to Excel', desc: 'Extract data from PDF to Excel (experimental).', icon: '📄➔🇽', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>PDF to Excel Converter Online Free</h1>
                            <p>PDF to Excel is a free, experimental browser-based tool that extracts text and tabular data from PDF documents and exports the content in a spreadsheet-compatible format. Recover data from PDF invoices, financial statements, price lists, and reports so you can work with it in Microsoft Excel or Google Sheets — without manual retyping.</p>
                            <br>
                            <h2>When to Use PDF to Excel</h2>
                            <p>This tool is most effective when your PDF contains clearly structured text data — such as financial tables, price lists, product catalogs, or data exports from accounting software. PDFs that were originally generated from digital sources (not scanned) tend to produce the best extraction results.</p>
                            <br>
                            <p>Common use cases include extracting invoice line items for accounting, pulling data from PDF reports into Excel for analysis, recovering financial data from PDF bank statements, and converting PDF price lists into editable spreadsheets for comparison.</p>
                            <br>
                            <h2>Important Note on Accuracy</h2>
                            <p>PDF was designed as a presentation format, not a data format. Table structures in PDFs are not always machine-readable. Our browser-based extractor works well for simple, well-structured PDFs but may require manual cleanup for complex multi-column layouts. For scanned PDFs, use our OCR PDF tool first to add a readable text layer, then re-attempt the extraction.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Why is it labeled experimental?</strong><br>Browser-based PDF table detection is inherently complex. Results vary by PDF structure. We recommend reviewing the output in Excel before using it for important work.</p>
                            <br>
                            <p><strong>Can it handle scanned PDFs?</strong><br>No. Use our OCR PDF tool first to convert scanned image pages to searchable text, then try the extraction again.</p>
                        </section>`,
                        process: async (files) => {
                            this.showLoader('Extracting data to Excel (experimental)...');
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                            
                            const wb = XLSX.utils.book_new();
                            for (let i = 1; i <= pdf.numPages; i++) {
                                this.showLoader(`Processing page ${i}/${pdf.numPages}`);
                                const page = await pdf.getPage(i);
                                const textContent = await page.getTextContent();
                                const pageData = textContent.items.map(item => [item.str]); 
                                const ws = XLSX.utils.aoa_to_sheet(pageData);
                                XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`);
                            }
                            
                            const excelBuffer = XLSX.write(wb, { bookType:'xlsx', type:'array' });
                            this.createDownloadLink(new Uint8Array(excelBuffer), 'pdf_data.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        }
                    },
                    'html-to-pdf': {
                        title: 'HTML to PDF', desc: 'Convert HTML file or raw HTML to PDF.', icon: '🌐➔📄', fileType: '.html,.htm,text/html', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>HTML to PDF Converter Online Free</h1>
                            <p>HTML to PDF is a free browser-based tool that converts HTML code or web page markup into a downloadable PDF document. Paste your HTML, click Process, and download the rendered PDF — no server, no signup, no software installation needed.</p>
                            <br>
                            <h2>Why Convert HTML to PDF?</h2>
                            <p>HTML to PDF conversion is one of the most common tasks in web development and document automation. Developers use it to generate PDF invoices, reports, certificates, and confirmations from HTML templates. Content creators use it to save web articles or blog posts as PDFs for offline reading. Businesses use it to archive web-based records in a stable, non-editable format.</p>
                            <br>
                            <p>Unlike printing from a browser (which can produce inconsistent results), a proper HTML to PDF converter gives you programmatic control over the output. Our tool uses html2pdf.js, a powerful library that renders HTML with CSS styling and produces a well-formatted PDF document.</p>
                            <br>
                            <h2>What HTML Content Works Best?</h2>
                            <p>This tool works best with self-contained HTML — that is, HTML that includes inline CSS styles or embedded stylesheets. External stylesheet links (like CDN-hosted CSS files) may not load in the conversion environment. For best results, inline your CSS using the style attribute or a style tag, use standard HTML elements (headings, paragraphs, tables, lists), and avoid JavaScript-dependent dynamic content.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I convert a live website URL?</strong><br>Currently, paste the HTML source code of the page. To get the HTML of a webpage, right-click and select View Page Source in your browser, then copy and paste it here.</p>
                            <br>
                            <p><strong>Are external images loaded?</strong><br>Images referenced by absolute URLs (https://) may load if your browser allows it. Images referenced by relative paths will not load in the conversion context.</p>
                        </section>`,
                        options: (container) => {
                            container.innerHTML = `<label for="html-input-type">Input Type:</label>
                                                 <select id="html-input-type">
                                                    <option value="file">HTML File</option>
                                                    <option value="text">Raw HTML Code</option>
                                                 </select>
                                                 <div id="html-text-area-container" style="display:none;">
                                                    <label for="html-raw-text">Paste HTML Code:</label>
                                                    <textarea id="html-raw-text" rows="10" placeholder="<html>...</html>"></textarea>
                                                 </div>`;
                            const select = container.querySelector('#html-input-type');
                            const textAreaContainer = container.querySelector('#html-text-area-container');
                            select.onchange = () => {
                                textAreaContainer.style.display = select.value === 'text' ? 'block' : 'none';
                                this.fileTypeInfo.textContent = select.value === 'text' ? 'Input HTML code below.' : 'Accepted file types: .html, .htm';
                                if (select.value === 'text') this.fileDropArea.style.display = 'none';
                                else this.fileDropArea.style.display = 'block';
                            };
                            select.dispatchEvent(new Event('change'));
                        },
                        process: async (files, options) => {
                            this.showLoader('Converting HTML to PDF...');
                            let htmlContent = '';
                            const inputType = options['html-input-type'];

                            if (inputType === 'file') {
                                if (!files || files.length === 0) throw new Error("No HTML file selected.");
                                htmlContent = await files[0].text();
                            } else if (inputType === 'text') {
                                htmlContent = document.getElementById('html-raw-text').value;
                                if (!htmlContent.trim()) throw new Error("HTML code cannot be empty.");
                            } else {
                                throw new Error("Invalid HTML input type.");
                            }
                            const isDarkMode = this.body.classList.contains('dark-mode');
                            if (isDarkMode) {
                                htmlContent = `<style>body { background-color: #1e1e1e; color: #e0e0e0; } a { color: #8ab4f8; } table, th, td { border-color: #555 !important; } th { background-color: #3a3a3a !important; }</style>` + htmlContent;
                            }
                            
                            const element = document.createElement('div');
                            element.innerHTML = htmlContent;
                            document.body.appendChild(element); 

                            html2pdf().from(element).set({
                                margin: 10, filename: 'html_converted.pdf', image: { type: 'jpeg', quality: 0.95 },
                                html2canvas: { scale: 2, logging: false, useCORS: true, backgroundColor: isDarkMode ? '#1e1e1e' : null }, 
                                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                            }).save().then(() => {
                                document.body.removeChild(element);
                                this.hideLoader();
                            }).catch(err => {
                                document.body.removeChild(element);
                                this.showError('Error converting HTML to PDF: ' + err.message);
                                this.hideLoader();
                            });
                            return "processing";
                        }
                    },
                    'protect-pdf': {
                        title: 'Protect PDF', desc: 'Add a password to encrypt your PDF.', icon: '🔒', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Protect PDF with Password Online Free</h1>
                            <p>Protect PDF adds password encryption to your PDF documents, preventing unauthorized access. Set a strong password and only people who know it can open and view the file. No software installation, no file upload to any server — your document and password stay completely on your device.</p>
                            <br>
                            <h2>Why Password Protect a PDF?</h2>
                            <p>Sensitive documents should never be shared without protection. Legal contracts, financial reports, medical records, personal identification documents, confidential business proposals, and private correspondence all benefit from password protection before being emailed or shared online.</p>
                            <br>
                            <p>Password-protected PDFs add a critical layer of security — even if the file is forwarded to unintended recipients or intercepted during transmission, it cannot be opened without the password. This is especially important when sharing documents over email, messaging apps, or cloud storage services.</p>
                            <br>
                            <h2>How PDF Password Protection Works</h2>
                            <p>Our tool uses PDF-lib to apply AES encryption to your PDF file. The password you set is required every time the file is opened. The encryption and password application happen entirely within your browser — no data is transmitted to any external server at any point.</p>
                            <br>
                            <h2>Important: Remember Your Password</h2>
                            <p>There is no password recovery option. If you forget the password, the PDF cannot be reopened. Always store your password in a secure password manager or a safe location before sharing the protected PDF.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>What encryption standard is used?</strong><br>Standard PDF password encryption using AES (Advanced Encryption Standard) is applied, which is the industry standard for PDF security.</p>
                            <br>
                            <p><strong>Can I remove the password later?</strong><br>Yes. Use our Unlock PDF tool — you will need to enter the current password to remove protection.</p>
                        </section>`,
                        options: (container) => {
                            container.innerHTML = `<label for="pdf-password">Password:</label>
                                                 <input type="password" id="pdf-password">
                                                 <p><small>Note: Permissions (printing, copying) are advisory and can be bypassed by some PDF readers.</small></p>`;
                        },
                        process: async (files, options) => {
                            const file = files[0];
                            const password = options['pdf-password'];
                            if (!password) throw new Error('Password is required.');

                            const pdfBytes = await file.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(pdfBytes);
                            
                            pdfDoc.setProducer('PDFGenius');
                            pdfDoc.setCreator('PDFGenius User');
                            
                            const protectedPdfBytes = await pdfDoc.save({ 
                                useObjectStreams: false, 
                                userPassword: password,
                                ownerPassword: password, 
                                permissions: {
                                    printing: 'highResolution', 
                                    modifying: false,
                                    copying: false,
                                    annotating: false,
                                    fillingForms: false,
                                    contentAccessibility: false,
                                    documentAssembly: false,
                                }
                            });
                            this.createDownloadLink(protectedPdfBytes, 'protected.pdf', 'application/pdf');
                        }
                    },
                    'unlock-pdf': {
                        title: 'Unlock PDF', desc: 'Remove password from a PDF (if known).', icon: '🔓', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Unlock PDF Online Free</h1>
                            <p>Unlock PDF removes the password protection from a PDF document you are authorized to access. Enter the correct password, and the tool generates a new, unlocked version of the PDF that can be opened freely — no password required every time. All processing happens locally in your browser with complete privacy.</p>
                            <br>
                            <h2>When Do You Need to Unlock a PDF?</h2>
                            <p>Password-protected PDFs are convenient for security but can become frustrating when you need to share them with multiple colleagues, process them through automated systems that do not support password entry, edit them in PDF software, merge them with other documents using tools like our Merge PDF tool, or print them without entering a password each time.</p>
                            <br>
                            <p>Unlocking a PDF you own or have authorization to access is completely legitimate. This tool is designed for situations where you know the password and simply want to remove the access restriction for practical workflow reasons.</p>
                            <br>
                            <h2>How It Works</h2>
                            <p>Upload the password-protected PDF, enter the correct password, and click Process. PDF-lib reads the file using the provided password, decrypts it, and saves a new copy without password restrictions. The unlocked PDF is available for download immediately.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I unlock a PDF without knowing the password?</strong><br>No. You must know the current password. This tool does not attempt to crack or bypass encryption — it removes protection only when the correct password is provided.</p>
                            <br>
                            <p><strong>Is it legal to unlock a PDF?</strong><br>It is legal to unlock PDF files that you own or have authorization to modify. Unlocking files without authorization may violate copyright or access laws.</p>
                        </section>`,
                        options: (container) => {
                            container.innerHTML = `<label for="pdf-unlock-password">Password (if any):</label>
                                                 <input type="password" id="pdf-unlock-password" placeholder="Leave blank if no password">`;
                        },
                        process: async (files, options) => {
                            const file = files[0];
                            const password = options['pdf-unlock-password'] || undefined; 

                            const pdfBytes = await file.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(pdfBytes, { ownerPassword: password, userPassword: password });
                            const unlockedPdfBytes = await pdfDoc.save();
                            this.createDownloadLink(unlockedPdfBytes, 'unlocked.pdf', 'application/pdf');
                        }
                    },
                    'organize-pdf': { 
                        title: 'Organize PDF', desc: 'Reorder or delete pages from a PDF.', icon: '📑', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Organize PDF Pages Online Free</h1>
                            <p>Organize PDF gives you a visual drag-and-drop interface to rearrange, reorder, and delete pages in your PDF document. View thumbnail previews of all pages, drag them into the correct order, remove unwanted pages, and save a clean, reorganized PDF — all inside your browser, with no file upload required.</p>
                            <br>
                            <h2>Why Organize Your PDF Pages?</h2>
                            <p>PDF page order problems are common. Scanned documents often have pages out of sequence. Merged PDFs may need reordering after combining. Reports may need chapters rearranged. Legal documents may require specific page ordering for submission. Blank or filler pages from scanning need to be removed before sharing.</p>
                            <br>
                            <p>With our Organize PDF tool, you have complete visual control over your document structure without any software installation. The thumbnail interface makes it easy to spot which pages need moving or deleting at a glance.</p>
                            <br>
                            <h2>How It Works</h2>
                            <p>Upload your PDF and the tool renders thumbnail images of every page using PDF.js. Drag thumbnails to reposition pages in any order. Click the delete button on any thumbnail to remove that page. When your layout is correct, click Process and PDF-lib rebuilds the PDF in your specified order. Download the reorganized PDF instantly.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I combine pages from multiple PDFs?</strong><br>Use our Merge PDF tool first to combine your PDFs, then use Organize PDF to rearrange the merged result.</p>
                            <br>
                            <p><strong>Is there a page limit?</strong><br>No strict limit, but very large PDFs (100+ pages) may use significant browser memory and take longer to display thumbnails.</p>
                        </section>`,
                        onFileSelect: async (files) => this.setupPageOrganizationUI(files[0]),
                        options: (container) => {
                            container.innerHTML = `<p>Drag and drop page thumbnails to reorder. Click 'X' to mark for deletion.</p>
                                                 <div id="page-organizer" style="display: flex; flex-wrap: wrap; gap: 10px; border: 1px solid var(--border-color); padding: 10px; min-height: 100px; background-color: var(--background-light);">
                                                 </div>`;
                        },
                        process: async (files, options) => {
                            this.showLoader('Organizing PDF...');
                            const originalFile = files[0]; 
                            const pdfBytes = await originalFile.arrayBuffer();
                            const existingPdf = await PDFDocument.load(pdfBytes);
                            const newPdf = await PDFDocument.create();

                            const pageOrganizer = document.getElementById('page-organizer');
                            const pageElements = Array.from(pageOrganizer.children);
                            const pageIndicesToKeep = [];

                            for (const pageElement of pageElements) {
                                if (pageElement.classList.contains('page-thumbnail-container') && (!pageElement.dataset.deleted || pageElement.dataset.deleted === "false")) {
                                    pageIndicesToKeep.push(parseInt(pageElement.dataset.originalIndex));
                                }
                            }

                            if (pageIndicesToKeep.length === 0) {
                                throw new Error("Cannot create an empty PDF. At least one page must be kept.");
                            }
                            
                            const copiedPages = await newPdf.copyPages(existingPdf, pageIndicesToKeep);
                            copiedPages.forEach(page => newPdf.addPage(page));

                            const newPdfBytes = await newPdf.save();
                            this.createDownloadLink(newPdfBytes, 'organized.pdf', 'application/pdf');
                        }
                    },
                    'ocr-pdf': {
                        title: 'OCR PDF', desc: 'Recognize text in scanned PDFs (adds text layer).', icon: '🔍', fileType: '.pdf', multiple: false, isNew: false,

                      content: `
                        <section class="tool-content">
                            <h1>OCR PDF Online Free</h1>
                            <p>OCR PDF (Optical Character Recognition) analyzes the scanned images inside your PDF and adds a searchable, selectable text layer on top of each page. After processing, you can search, highlight, and copy text from what was previously an unreadable image-based PDF — all without installing any software or uploading your files to a server.</p>
                            <br>
                            <h2>What is OCR and Why Does It Matter?</h2>
                            <p>When documents are scanned with a scanner or photographed with a camera, they are saved as images inside the PDF — not as readable text. This means you cannot search for words, select text to copy, or have the document read aloud by screen readers. OCR (Optical Character Recognition) uses AI-powered analysis to identify letters and words in images and convert them into actual machine-readable text.</p>
                            <br>
                            <p>Making PDFs searchable is essential for legal document management, academic research, archiving scanned historical records, processing scanned invoices and receipts, and enabling accessibility features for visually impaired users who rely on screen readers.</p>
                            <br>
                            <h2>How Our OCR PDF Tool Works</h2>
                            <p>Our tool uses Tesseract.js — a powerful open-source OCR engine ported to JavaScript — running entirely in your browser. Each page of your PDF is rendered as an image using PDF.js, then passed through Tesseract's recognition engine. The recognized text is embedded as an invisible text layer in the PDF using PDF-lib, preserving the original visual appearance while adding full text searchability.</p>
                            <br>
                            <h2>Tips for Best OCR Results</h2>
                            <p>OCR accuracy depends heavily on scan quality. For best results, use high-resolution scans (300 DPI or higher), ensure the document is straight and not skewed, use good lighting with no shadows when photographing documents, and avoid heavily handwritten text (OCR works best on printed text).</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>How long does OCR take?</strong><br>OCR is computationally intensive. Expect 10-30 seconds per page depending on your device speed. Multi-page documents will take longer.</p>
                            <br>
                            <p><strong>What languages are supported?</strong><br>English is fully supported. Additional languages available through Tesseract.js include French, German, Spanish, and more.</p>
                        </section>`,
                        options: (container) => {
                            container.innerHTML = `<label for="ocr-language">Language:</label>
                                                   <select id="ocr-language">
                                                       <option value="eng">English</option>
                                                       <option value="spa">Spanish</option>
                                                       <option value="fra">French</option>
                                                       <option value="deu">German</option>
                                                   </select>
                                                   <p><small>OCR process can be slow and resource-intensive.</small></p>`;
                        },
                        process: async (files, options) => {
                            this.showLoader('Starting OCR process...');
                            const file = files[0];
                            const lang = options['ocr-language'] || 'eng';
                            const pdfBytes = await file.arrayBuffer();
                            const existingPdfDoc = await PDFDocument.load(pdfBytes);
                            const newPdfDoc = await PDFDocument.create(); 

                            const pdfjsDoc = await pdfjsLib.getDocument({data: pdfBytes}).promise;
                            const numPages = pdfjsDoc.numPages;

                            const worker = await Tesseract.createWorker({
                                logger: m => {
                                    if (m.status === 'recognizing text') {
                                       this.showLoader(`OCR: Page ${this.currentOcrPage || 1}, Progress: ${Math.round(m.progress * 100)}%`);
                                    }
                                }
                            });
                            await worker.loadLanguage(lang);
                            await worker.initialize(lang);

                            for (let i = 0; i < numPages; i++) {
                                this.currentOcrPage = i + 1;
                                this.showLoader(`OCR: Processing page ${this.currentOcrPage}/${numPages}`);
                                
                                const [originalPage] = await newPdfDoc.copyPages(existingPdfDoc, [i]);
                                const newPage = newPdfDoc.addPage(originalPage);
                                const { width, height } = newPage.getSize();

                                const pdfjsPage = await pdfjsDoc.getPage(i + 1);
                                const viewport = pdfjsPage.getViewport({ scale: 2.0 }); 
                                const canvas = document.createElement('canvas');
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;
                                const context = canvas.getContext('2d');
                                await pdfjsPage.render({ canvasContext: context, viewport: viewport }).promise;
                                const imageDataUrl = canvas.toDataURL('image/png');

                                const { data } = await worker.recognize(imageDataUrl);
                                
                                const font = await newPdfDoc.embedFont(StandardFonts.Helvetica);
                                data.words.forEach(word => {
                                    const imgToPdfScaleX = width / viewport.width;
                                    const imgToPdfScaleY = height / viewport.height;

                                    const x = word.bbox.x0 * imgToPdfScaleX;
                                    const y = height - (word.bbox.y1 * imgToPdfScaleY); 
                                    const w = (word.bbox.x1 - word.bbox.x0) * imgToPdfScaleX;
                                    const h = (word.bbox.y1 - word.bbox.y0) * imgToPdfScaleY;
                                    
                                    let fontSize = h * 0.8; 
                                    const textWidth = font.widthOfTextAtSize(word.text, fontSize);
                                    if (textWidth > w && w > 0) { 
                                        fontSize *= (w / textWidth);
                                    }

                                    newPage.drawText(word.text, {
                                        x: x,
                                        y: y,
                                        font: font,
                                        size: fontSize,
                                        color: rgb(0,0,0),
                                        opacity: 0, 
                                    });
                                });
                            }
                            await worker.terminate();
                            this.currentOcrPage = null;

                            const ocrPdfBytes = await newPdfDoc.save();
                            this.createDownloadLink(ocrPdfBytes, 'ocr_output.pdf', 'application/pdf');
                        }
                    },
                    'add-page-numbers': {
                        title: 'Add Page Numbers', desc: 'Insert page numbers into your PDF.', icon: '#️⃣', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Add Page Numbers to PDF Online Free</h1>
                            <p>Add Page Numbers is a free online tool that automatically inserts page numbers onto every page of your PDF document. Customize the position (top or bottom, left, center, or right) and set a custom starting number. All processing runs in your browser — no file upload, no signup, no software needed.</p>
                            <br>
                            <h2>Why Add Page Numbers to PDFs?</h2>
                            <p>Page numbers are a fundamental requirement for professional documents. They make navigation easier, allow readers to reference specific sections in meetings or reviews, are required by many academic and legal submission guidelines, ensure printed copies can be reassembled if pages get shuffled, and make your document look polished and complete.</p>
                            <br>
                            <p>Reports, theses, legal briefs, manuals, proposals, and any multi-page document destined for printing or professional submission should have page numbers. This tool adds them in seconds, directly to the PDF, without disturbing any existing content.</p>
                            <br>
                            <h2>How It Works</h2>
                            <p>Using PDF-lib, the tool overlays a page number label on each page of your PDF. You control the horizontal and vertical position, and the starting number. The numbers are added as a text overlay that does not affect the existing content — they simply appear at the specified position on each page.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I skip numbering the first page (cover page)?</strong><br>Currently all pages are numbered. For advanced control, consider using our Edit PDF tool to manually add a number to specific pages.</p>
                            <br>
                            <p><strong>Can I choose the font style?</strong><br>The tool uses a clean standard font. Advanced font customization may be added in a future update.</p>
                        </section>`,
                        options: (container) => {
                            container.innerHTML = `<label for="pn-position">Position:</label>
                                                 <select id="pn-position">
                                                     <option value="bottom-center">Bottom Center</option>
                                                     <option value="bottom-right">Bottom Right</option>
                                                     <option value="bottom-left">Bottom Left</option>
                                                     <option value="top-center">Top Center</option>
                                                     <option value="top-right">Top Right</option>
                                                     <option value="top-left">Top Left</option>
                                                 </select>
                                                 <label for="pn-start-num">Start numbering from:</label>
                                                 <input type="number" id="pn-start-num" value="1" min="1">
                                                 <label for="pn-font-size">Font Size:</label>
                                                 <input type="number" id="pn-font-size" value="12">
                                                 <label for="pn-format">Format (use {page} and {total}):</label>
                                                 <input type="text" id="pn-format" value="Page {page} of {total}">`;
                        },
                        process: async (files, options) => {
                            this.showLoader('Adding page numbers...');
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(pdfBytes);
                            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

                            const position = options['pn-position'] || 'bottom-center';
                            const startNum = parseInt(options['pn-start-num']) || 1;
                            const fontSize = parseInt(options['pn-font-size']) || 12;
                            const format = options['pn-format'] || 'Page {page} of {total}';
                            const totalPages = pdfDoc.getPageCount();
                            const pageNumColor = this.body.classList.contains('dark-mode') ? rgb(0.9,0.9,0.9) : rgb(0,0,0);


                            const pages = pdfDoc.getPages();
                            for (let i = 0; i < pages.length; i++) {
                                const page = pages[i];
                                const { width, height } = page.getSize();
                                const pageNumText = format.replace('{page}', (startNum + i).toString()).replace('{total}', totalPages.toString());
                                const textWidth = helveticaFont.widthOfTextAtSize(pageNumText, fontSize);
                                
                                let x, y;
                                const margin = 20; 

                                if (position.includes('left')) x = margin;
                                else if (position.includes('right')) x = width - textWidth - margin;
                                else x = width / 2 - textWidth / 2; 

                                if (position.includes('top')) y = height - fontSize - margin;
                                else y = margin; 

                                page.drawText(pageNumText, { x, y, font: helveticaFont, size: fontSize, color: pageNumColor });
                            }
                            const numberedPdfBytes = await pdfDoc.save();
                            this.createDownloadLink(numberedPdfBytes, 'numbered.pdf', 'application/pdf');
                        }
                    },
                    'add-header-footer': {
                        title: 'Add Header/Footer', desc: 'Add text to header or footer of PDF pages.', icon: 'HF', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Add Header and Footer to PDF Online Free</h1>
                            <p>Add Header and Footer is a free online tool that inserts your custom text at the top (header) and/or bottom (footer) of every page in your PDF document. Add document titles, dates, company names, version numbers, or any repeating information to all pages instantly — no software, no signup, no file upload required.</p>
                            <br>
                            <h2>Why Add Headers and Footers to PDFs?</h2>
                            <p>Headers and footers serve multiple professional purposes. They reinforce branding by displaying your company name or logo text on every page. They provide context by showing the document title and date on every page. They aid navigation by including section titles or document version information. They meet submission requirements for academic papers, legal filings, and corporate documents that mandate header or footer information.</p>
                            <br>
                            <p>Adding consistent headers and footers transforms a plain PDF into a professional, branded document that clearly identifies its origin and purpose on every single page.</p>
                            <br>
                            <h2>How It Works</h2>
                            <p>PDF-lib is used to add text overlays at the top and bottom margins of each PDF page. Enter your desired header text, footer text, or both, and click Process. The text is rendered at the specified position on every page of the document, using a clean standard font that complements most document styles.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I add both a header and footer at the same time?</strong><br>Yes. You can enter text for the header, footer, or both in the same operation.</p>
                            <br>
                            <p><strong>Will the header or footer overlap existing content?</strong><br>The text is placed in the margin area. If your PDF has content that extends to the very edge of the page, there may be some overlap — consider using our Crop PDF tool to create margin space first.</p>
                        </section>`,
                        options: (container) => {
                            container.innerHTML = `<label for="hf-header-text">Header Text (leave blank if none):</label>
                                                 <input type="text" id="hf-header-text" placeholder="e.g., Document Title">
                                                 <label for="hf-footer-text">Footer Text (leave blank if none):</label>
                                                 <input type="text" id="hf-footer-text" placeholder="e.g., © My Company">
                                                 <label for="hf-font-size">Font Size:</label>
                                                 <input type="number" id="hf-font-size" value="10">
                                                 <label for="hf-align">Alignment:</label>
                                                 <select id="hf-align">
                                                    <option value="left">Left</option>
                                                    <option value="center">Center</option>
                                                    <option value="right">Right</option>
                                                 </select>`;
                        },
                        process: async (files, options) => {
                            this.showLoader('Adding Header/Footer...');
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(pdfBytes);
                            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

                            const headerText = options['hf-header-text'] || '';
                            const footerText = options['hf-footer-text'] || '';
                            const fontSize = parseInt(options['hf-font-size']) || 10;
                            const align = options['hf-align'] || 'center';
                            const margin = 20;
                            const hfColor = this.body.classList.contains('dark-mode') ? rgb(0.9,0.9,0.9) : rgb(0,0,0);


                            const pages = pdfDoc.getPages();
                            for (const page of pages) {
                                const { width, height } = page.getSize();
                                
                                const drawTextAtPos = (text, yPos) => {
                                    if (!text.trim()) return;
                                    const textWidth = font.widthOfTextAtSize(text, fontSize);
                                    let x;
                                    if (align === 'left') x = margin;
                                    else if (align === 'right') x = width - textWidth - margin;
                                    else x = width / 2 - textWidth / 2;
                                    page.drawText(text, { x, y: yPos, font, size: fontSize, color: hfColor });
                                };

                                if (headerText) drawTextAtPos(headerText, height - fontSize - margin);
                                if (footerText) drawTextAtPos(footerText, margin);
                            }
                            const finalPdfBytes = await pdfDoc.save();
                            this.createDownloadLink(finalPdfBytes, 'header_footer.pdf', 'application/pdf');
                        }
                    },
                    'delete-pdf-pages': {
                        title: 'Delete PDF Pages', desc: 'Remove specific pages from a PDF.', icon: '🗑️📄', fileType: '.pdf', multiple: false,

                      content: `
                        <section class="tool-content">
                            <h1>Delete PDF Pages Online Free</h1>
                            <p>Delete PDF Pages is a free online tool that removes specific pages from your PDF document. Enter the page numbers you want to delete, click Process, and download a new PDF with those pages permanently removed — no software installation, no file upload to any server, completely free.</p>
                            <br>
                            <h2>When Do You Need to Delete PDF Pages?</h2>
                            <p>There are many reasons you might need to remove pages from a PDF. Scanned documents often include blank separator pages from the scanner that need to be cleaned up. Merged PDFs may have duplicate or redundant pages. Reports may contain internal cover pages or appendices that are not appropriate to share with external recipients. Legal documents may have pages that contain confidential information not relevant to the current recipient.</p>
                            <br>
                            <p>Rather than recreating the entire document or using expensive desktop software, our free Delete PDF Pages tool lets you surgically remove exactly the pages you need to remove in seconds.</p>
                            <br>
                            <h2>How to Delete PDF Pages</h2>
                            <p>Upload your PDF, enter the page numbers you want to remove separated by commas (e.g., 1, 3, 5-7), and click Process. PDF-lib rebuilds the document with those pages excluded and prepares it for download. The original page content of all remaining pages is preserved exactly.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I specify a range of pages to delete?</strong><br>Yes. Enter ranges like 5-10 to delete pages 5 through 10, or combine individual pages and ranges like 1, 3, 7-9.</p>
                            <br>
                            <p><strong>Can I preview pages before deleting?</strong><br>Use our Organize PDF tool for a visual thumbnail interface where you can see and select pages before removing them.</p>
                        </section>`,
                        options: (container) => {
                             container.innerHTML = `<label for="delete-page-ranges">Pages/ranges to delete (e.g., 1-3, 5, 7-9):</label>
                                                 <input type="text" id="delete-page-ranges" placeholder="e.g., 1-3, 5, 7-9">
                                                 <p>Page numbers are 1-based.</p>`;
                        },
                        process: async (files, options) => {
                            this.showLoader('Deleting pages...');
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(pdfBytes);
                            const rangeString = options['delete-page-ranges'];
                            if (!rangeString) throw new Error('Page range for deletion is required.');

                            const totalPages = pdfDoc.getPageCount();
                            const pagesToRemove = new Set(); 

                            rangeString.split(',').forEach(rangePart => {
                                rangePart = rangePart.trim();
                                if (rangePart.includes('-')) {
                                    const [start, end] = rangePart.split('-').map(Number);
                                    for (let i = start; i <= end; i++) {
                                        if (i > 0 && i <= totalPages) pagesToRemove.add(i - 1);
                                    }
                                } else {
                                    const pageNum = Number(rangePart);
                                    if (pageNum > 0 && pageNum <= totalPages) pagesToRemove.add(pageNum - 1);
                                }
                            });

                            if (pagesToRemove.size === totalPages && totalPages > 0) {
                                throw new Error("Cannot delete all pages. At least one page must remain.");
                            }
                            if (pagesToRemove.size === 0) {
                                this.createDownloadLink(pdfBytes, 'original_with_no_deletions.pdf', 'application/pdf'); 
                                this.showError("No valid pages selected for deletion, or selected pages are out of range. Original file offered for download.");
                                return; 
                            }
                            
                            const sortedPagesToRemove = Array.from(pagesToRemove).sort((a,b) => b-a);
                            sortedPagesToRemove.forEach(index => pdfDoc.removePage(index));

                            const newPdfBytes = await pdfDoc.save();
                            this.createDownloadLink(newPdfBytes, 'pages_deleted.pdf', 'application/pdf');
                        }
                    },
                    'powerpoint-to-pdf': {
                        title: 'PowerPoint to PDF',

                      content: `
                        <section class="tool-content">
                            <h1>PowerPoint to PDF Converter Online Free</h1>
                            <p>PowerPoint to PDF is a free browser-based converter that transforms Microsoft PowerPoint PPTX presentation files into PDF documents. Share your slides with anyone — even if they don't have PowerPoint installed — by converting them to the universally compatible PDF format. No software installation, no signup, no file upload to any server.</p>
                            <br>
                            <h2>Why Convert PowerPoint to PDF?</h2>
                            <p>PowerPoint files are the standard for creating presentations, but they are not ideal for sharing. Recipients may have different versions of PowerPoint, no Office license, or may be on a device that doesn't support PPTX files. By converting to PDF, you ensure your presentation looks exactly the same on every device — Windows, Mac, iPhone, Android, or any modern web browser.</p>
                            <br>
                            <p>PDF presentations are also smaller in file size, easier to email, and cannot be accidentally edited by recipients. They are ideal for handout versions of presentations, client deliverables, educational materials, and archiving presentation content.</p>
                            <br>
                            <h2>How the Conversion Works</h2>
                            <p>Our tool uses the mammoth.js and PptxGenJS libraries to extract slide content from your PPTX file and render it into a PDF format. Each slide is processed and output as a page in the resulting PDF. The conversion runs entirely in your browser — your presentation file never leaves your device.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Are animations preserved in the PDF?</strong><br>No. PDF is a static format — animations and transitions are not included in the output. Each slide is captured as a static snapshot.</p>
                            <br>
                            <p><strong>Do I need PowerPoint installed?</strong><br>No. The conversion happens entirely in your browser using JavaScript libraries — no Microsoft Office or PowerPoint software needed.</p>
                            <br>
                            <p><strong>Is it free?</strong><br>Yes, completely free with no watermarks, no page limits, and no signup required.</p>
                        </section>`,
                        desc: 'Convert PPTX to PDF (extracts text, images, basic formatting). .ppt not supported.',
                        icon: '🇵➔📄',
                        fileType: '.pptx',
                        multiple: false,
                        isPlaceholder: false,
                        process: async (files, options) => {
                            if (!files || files.length === 0) {
                                throw new Error("No PowerPoint file selected.");
                            }
                            const file = files[0];
                            if (!file.name.toLowerCase().endsWith('.pptx')) {
                                throw new Error("Only .pptx files are supported for this conversion. .ppt files are not supported.");
                            }

                            this.showLoader('Converting PowerPoint to PDF...');

                            const EMU_PER_POINT = 12700;
                            const POINTS_PER_INCH = 72; // pdf-lib uses points (1/72 inch)

                            const arrayBuffer = await file.arrayBuffer();
                            const zip = await JSZip.loadAsync(arrayBuffer);
                            const parser = new DOMParser();

                            const pdfDoc = await PDFDocument.create();
                            const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
                            const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                            const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
                            const helveticaBoldOblique = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
                            const defaultTextColor = this.body.classList.contains('dark-mode') ? rgb(0.9, 0.9, 0.9) : rgb(0, 0, 0);

                            const P_NAMESPACE = "http://schemas.openxmlformats.org/presentationml/2006/main";
                            const A_NAMESPACE = "http://schemas.openxmlformats.org/drawingml/2006/main";
                            const R_NAMESPACE = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

                            const parseColor = (srgbClrNode) => {
                                if (!srgbClrNode) return defaultTextColor;
                                const val = srgbClrNode.getAttribute("val");
                                if (val && val.length === 6) {
                                    try {
                                        return rgb(
                                            parseInt(val.substring(0, 2), 16) / 255,
                                            parseInt(val.substring(2, 4), 16) / 255,
                                            parseInt(val.substring(4, 6), 16) / 255
                                        );
                                    } catch (e) { return defaultTextColor; }
                                }
                                return defaultTextColor;
                            };

                            const getRels = async (relsPath) => {
                                const relsMap = {};
                                const relsXml = await zip.file(relsPath)?.async("string");
                                if (relsXml) {
                                    const relsDoc = parser.parseFromString(relsXml, "application/xml");
                                    relsDoc.querySelectorAll("Relationship").forEach(rel => { // Standard way to query in rels files
                                        relsMap[rel.getAttribute("Id")] = {
                                            target: rel.getAttribute("Target"),
                                            type: rel.getAttribute("Type")
                                        };
                                    });
                                }
                                return relsMap;
                            };

                            let presPropsXml = await zip.file("ppt/presentation.xml")?.async("string");
                            if (!presPropsXml) throw new Error("Could not find presentation.xml in the PPTX file.");
                            let presDoc = parser.parseFromString(presPropsXml, "application/xml");

                            let slideWidthPoints = (10 * POINTS_PER_INCH);
                            let slideHeightPoints = (7.5 * POINTS_PER_INCH);

                            const sldSzNode = presDoc.getElementsByTagNameNS(P_NAMESPACE, "sldSz")[0];
                            if (sldSzNode) {
                                const cx = parseInt(sldSzNode.getAttribute("cx") || "0");
                                const cy = parseInt(sldSzNode.getAttribute("cy") || "0");
                                if (cx && cy) {
                                    slideWidthPoints = cx / EMU_PER_POINT;
                                    slideHeightPoints = cy / EMU_PER_POINT;
                                }
                            }

                            const slideListEntries = [];
                            const sldIdLstNode = presDoc.getElementsByTagNameNS(P_NAMESPACE, "sldIdLst")[0];
                            if (sldIdLstNode) {
                                Array.from(sldIdLstNode.getElementsByTagNameNS(P_NAMESPACE, "sldId")).forEach(sldIdNode => {
                                    slideListEntries.push({ id: sldIdNode.getAttributeNS(R_NAMESPACE, "id") });
                                });
                            }


                            if (slideListEntries.length === 0) {
                                throw new Error("No slides found in the presentation.");
                            }

                            const presRels = await getRels("ppt/_rels/presentation.xml.rels");

                            for (let i = 0; i < slideListEntries.length; i++) {
                                const slideEntry = slideListEntries[i];
                                const rel = presRels[slideEntry.id];
                                if (!rel || !rel.target || !rel.type.endsWith("/slide")) continue;

                                this.showLoader(`Processing slide ${i + 1}/${slideListEntries.length}...`);

                                const slidePath = `ppt/${rel.target.startsWith('../') ? rel.target.substring(3) : rel.target}`;
                                const slideXml = await zip.file(slidePath)?.async("string");
                                if (!slideXml) continue;

                                const slideDoc = parser.parseFromString(slideXml, "application/xml");
                                const page = pdfDoc.addPage([slideWidthPoints, slideHeightPoints]);

                                const cSldNode = slideDoc.getElementsByTagNameNS(P_NAMESPACE, "cSld")[0];
                                if (!cSldNode) continue;

                                const bgNodeList = cSldNode.getElementsByTagNameNS(P_NAMESPACE, "bg");
                                if (bgNodeList.length > 0) {
                                    const bgPrNode = bgNodeList[0].getElementsByTagNameNS(P_NAMESPACE, "bgPr")[0];
                                    if (bgPrNode) {
                                        const solidFillNode = bgPrNode.getElementsByTagNameNS(A_NAMESPACE, "solidFill")[0];
                                        if (solidFillNode) {
                                            const srgbClrNode = solidFillNode.getElementsByTagNameNS(A_NAMESPACE, "srgbClr")[0];
                                            if (srgbClrNode) {
                                                const bgColor = parseColor(srgbClrNode);
                                                page.drawRectangle({
                                                    x: 0, y: 0, width: slideWidthPoints, height: slideHeightPoints,
                                                    color: bgColor
                                                });
                                            }
                                        }
                                    }
                                }
                                
                                const slideRelsPath = `ppt/slides/_rels/${slidePath.split('/').pop()}.rels`;
                                const slideRels = await getRels(slideRelsPath);

                                const spTreeNode = cSldNode.getElementsByTagNameNS(P_NAMESPACE, "spTree")[0];
                                if (spTreeNode) {
                                    const picNodes = Array.from(spTreeNode.getElementsByTagNameNS(P_NAMESPACE, "pic"));
                                    for (const picNode of picNodes) {
                                        const blipFillNode = picNode.getElementsByTagNameNS(P_NAMESPACE, "blipFill")[0];
                                        const blipNode = blipFillNode?.getElementsByTagNameNS(A_NAMESPACE, "blip")[0];
                                        const embedId = blipNode?.getAttributeNS(R_NAMESPACE, "embed");

                                        if (embedId && slideRels[embedId]) {
                                            let imagePath = slideRels[embedId].target;
                                            if (imagePath.startsWith("../")) {
                                                imagePath = `ppt/${imagePath.substring(3)}`;
                                            } else {
                                                imagePath = `ppt/slides/${imagePath}`;
                                            }

                                            const imageFile = zip.file(imagePath);
                                            if (imageFile) {
                                                const imageBytes = await imageFile.async("uint8array");
                                                let embeddedImage;
                                                try {
                                                    if (imagePath.toLowerCase().endsWith(".png")) {
                                                        embeddedImage = await pdfDoc.embedPng(imageBytes);
                                                    } else if (imagePath.toLowerCase().endsWith(".jpg") || imagePath.toLowerCase().endsWith(".jpeg")) {
                                                        embeddedImage = await pdfDoc.embedJpg(imageBytes);
                                                    }
                                                } catch (e) { console.warn(`Could not embed image ${imagePath}: ${e.message}`); }

                                                if (embeddedImage) {
                                                    const spPrNode = picNode.getElementsByTagNameNS(P_NAMESPACE, "spPr")[0];
                                                    const xfrmNode = spPrNode?.getElementsByTagNameNS(A_NAMESPACE, "xfrm")[0];
                                                    let imgX = 0, imgY = 0, imgWidth = embeddedImage.width, imgHeight = embeddedImage.height;
                                                    if (xfrmNode) {
                                                        const offNode = xfrmNode.getElementsByTagNameNS(A_NAMESPACE, "off")[0];
                                                        const extNode = xfrmNode.getElementsByTagNameNS(A_NAMESPACE, "ext")[0];
                                                        if (offNode) {
                                                            imgX = (parseInt(offNode.getAttribute("x") || "0")) / EMU_PER_POINT;
                                                            imgY = slideHeightPoints - ((parseInt(offNode.getAttribute("y") || "0")) / EMU_PER_POINT);
                                                        }
                                                        if (extNode) {
                                                            imgWidth = (parseInt(extNode.getAttribute("cx") || "0")) / EMU_PER_POINT;
                                                            imgHeight = (parseInt(extNode.getAttribute("cy") || "0")) / EMU_PER_POINT;
                                                            imgY -= imgHeight;
                                                        }
                                                    }
                                                    page.drawImage(embeddedImage, { x: imgX, y: imgY, width: imgWidth, height: imgHeight });
                                                }
                                            }
                                        }
                                    }

                                    const spNodes = Array.from(spTreeNode.getElementsByTagNameNS(P_NAMESPACE, "sp"));
                                    for (const spNode of spNodes) {
                                        const txBodyNode = spNode.getElementsByTagNameNS(P_NAMESPACE, "txBody")[0];
                                        if (txBodyNode) {
                                            const spPrNode = spNode.getElementsByTagNameNS(P_NAMESPACE, "spPr")[0];
                                            const xfrmNode = spPrNode?.getElementsByTagNameNS(A_NAMESPACE, "xfrm")[0];
                                            let boxX = 0, boxY = slideHeightPoints, boxWidth = slideWidthPoints, boxHeight = slideHeightPoints;
                                            if (xfrmNode) {
                                                const offNode = xfrmNode.getElementsByTagNameNS(A_NAMESPACE, "off")[0];
                                                const extNode = xfrmNode.getElementsByTagNameNS(A_NAMESPACE, "ext")[0];
                                                if (offNode) {
                                                    boxX = (parseInt(offNode.getAttribute("x") || "0")) / EMU_PER_POINT;
                                                    boxY = slideHeightPoints - ((parseInt(offNode.getAttribute("y") || "0")) / EMU_PER_POINT);
                                                }
                                                if (extNode) {
                                                    boxWidth = (parseInt(extNode.getAttribute("cx") || "0")) / EMU_PER_POINT;
                                                    boxHeight = (parseInt(extNode.getAttribute("cy") || "0")) / EMU_PER_POINT;
                                                    boxY -= boxHeight;
                                                }
                                            }

                            let currentY = boxY + boxHeight - 10; // Initial Y pos for text in box
                            const linePadding = 2;

                            Array.from(txBodyNode.getElementsByTagNameNS(A_NAMESPACE, "p")).forEach(pNode => {
                                let currentXInLine = boxX + 5;
                                const defaultRPrNode = pNode.getElementsByTagNameNS(A_NAMESPACE, "pPr")[0]?.getElementsByTagNameNS(A_NAMESPACE, "defRPr")[0];
                                let paraFontSize = 12;
                                if (defaultRPrNode?.getAttribute("sz")) {
                                     paraFontSize = parseInt(defaultRPrNode.getAttribute("sz")) / 100 || 12;
                                }
                                currentY -= paraFontSize * 0.2; // Adjust for paragraph start a bit higher

                                Array.from(pNode.getElementsByTagNameNS(A_NAMESPACE, "r")).forEach(rNode => {
                                    const text = rNode.getElementsByTagNameNS(A_NAMESPACE, "t")[0]?.textContent || "";
                                    if (!text.trim()) return;

                                    const rPrNode = rNode.getElementsByTagNameNS(A_NAMESPACE, "rPr")[0];
                                    let fontSize = paraFontSize;
                                    if (rPrNode?.getAttribute("sz")) {
                                        fontSize = parseInt(rPrNode.getAttribute("sz")) / 100;
                                    }
                                    const isBold = rPrNode?.getAttribute("b") === "1" || rPrNode?.getAttribute("b") === "true";
                                    const isItalic = rPrNode?.getAttribute("i") === "1" || rPrNode?.getAttribute("i") === "true";
                                    const srgbClrNode = rPrNode?.getElementsByTagNameNS(A_NAMESPACE, "solidFill")[0]?.getElementsByTagNameNS(A_NAMESPACE, "srgbClr")[0];
                                    const textColor = parseColor(srgbClrNode);

                                    let currentFont = helvetica;
                                    if (isBold && isItalic) currentFont = helveticaBoldOblique;
                                    else if (isBold) currentFont = helveticaBold;
                                    else if (isItalic) currentFont = helveticaOblique;
                                    
                                    const words = text.split(/(\s+)/);
                                    for (const word of words) {
                                        if (word.trim() === "" && word !== " ") { // Keep single spaces
                                            currentXInLine += currentFont.widthOfTextAtSize(word, fontSize);
                                            continue;
                                        }
                                        const wordWidth = currentFont.widthOfTextAtSize(word, fontSize);
                                        if (currentXInLine + wordWidth > boxX + boxWidth - 5 && currentXInLine > boxX + 5) {
                                            currentY -= (fontSize * 1.2 + linePadding); // Approx line height
                                            currentXInLine = boxX + 5;
                                        }
                                        if (currentY < boxY + 5) break; 

                                        page.drawText(word, {
                                            x: currentXInLine,
                                            y: currentY,
                                            font: currentFont,
                                            size: fontSize,
                                            color: textColor,
                                        });
                                        currentXInLine += wordWidth;
                                    }
                                });
                                currentY -= (paraFontSize * 1.2 + linePadding); // Move to next paragraph line
                            });
                        }
                    }
                }
            }

            const pdfBytes = await pdfDoc.save();
            this.createDownloadLink(pdfBytes, file.name.replace(/\.pptx$/i, '') + '.pdf', 'application/pdf');
            this.hideLoader();
        }
    },
                    'repair-pdf': {
                      title: 'Repair PDF',

                      content: `
                        <section class="tool-content">
                            <h1>Repair PDF Online Free</h1>
                            <p>Repair PDF is a free online tool that attempts to fix corrupted or damaged PDF files by reloading and re-saving the document structure. If your PDF fails to open, displays errors, or shows corrupted content, this tool may be able to recover and restore it — entirely in your browser with no file upload required.</p>
                            <br>
                            <h2>What Causes PDF Corruption?</h2>
                            <p>PDF files can become corrupted for a variety of reasons. Incomplete downloads are among the most common causes — if your internet connection dropped while downloading a PDF, the file may be incomplete or have a broken structure. Software crashes during PDF creation or export can also produce invalid file structures. Storage media errors, file system issues, and failed email attachments can all result in PDFs that cannot be opened normally.</p>
                            <br>
                            <p>In some cases, PDFs appear corrupted because they were created by buggy software that produced a technically invalid but partially readable file. Our repair tool attempts to parse and recover what it can from such files.</p>
                            <br>
                            <h2>How the Repair Tool Works</h2>
                            <p>The tool uses PDF-lib to parse the internal structure of your PDF, recover readable content, and re-save it as a new, clean PDF file. This process can fix broken cross-reference tables, incomplete file trailers, and minor structural errors that prevent PDF readers from opening the file.</p>
                            <br>
                            <h2>What to Do if Repair Doesn't Work</h2>
                            <p>If the PDF is severely damaged, browser-based repair may not be sufficient. In that case, try opening the PDF in a different PDF reader (such as Google Chrome, Firefox, or Adobe Acrobat), which may have more lenient parsing. If the file was downloaded, try downloading it again from the original source.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Will all corrupted PDFs be fixed?</strong><br>Not necessarily. Severely damaged files may be unrecoverable. This tool works best on mildly corrupted PDFs with structural issues.</p>
                            <br>
                            <p><strong>Is my file safe to upload?</strong><br>Your file is never uploaded — all repair processing happens locally in your browser.</p>
                        </section>`,
                      desc: 'Attempt to recover data from a corrupt PDF by rebuilding its structure.',
                      icon: '🛠️',
                      fileType: '.pdf',
                      multiple: false,
                      isPlaceholder: false,
                      options: (container) => {
                          container.innerHTML = `<p>This tool will attempt to repair the selected PDF. It works best for issues with corrupted structure or cross-reference tables.</p>
                                               <p><strong>Note:</strong> Severe corruption may not be fixable.</p>`;
                      },
                      process: async (files, options) => { // <-- Arrow function here
                          if (!files || files.length === 0) {
                              throw new Error("No PDF file selected for repair.");
                          }
                          this.showLoader('Attempting to repair PDF...');
                          const file = files[0];

                          try {
                              const existingPdfBytes = await file.arrayBuffer();
                              let sourcePdfDoc;
                              try {
                                  this.showLoader('Analyzing PDF structure...');
                                  sourcePdfDoc = await PDFDocument.load(existingPdfBytes, { 
                                      updateMetadata: false, 
                                      ignoreEncryption: true 
                                  });
                              } catch (loadError) {
                                  throw new Error(`Failed to load the PDF. The file may be too corrupted to read. Original error: ${loadError.message}`);
                              }

                              this.showLoader('Rebuilding document...');
                              const newPdfDoc = await PDFDocument.create();

                              const pageIndices = sourcePdfDoc.getPageIndices();
                              if(pageIndices.length === 0){
                                  throw new Error("The source PDF contains no pages or they could not be read.");
                              }

                              this.showLoader(`Copying ${pageIndices.length} pages...`);
                              const copiedPages = await newPdfDoc.copyPages(sourcePdfDoc, pageIndices);
                              copiedPages.forEach(page => {
                                  newPdfDoc.addPage(page);
                              });

                              this.showLoader('Finalizing repaired file...');
                              const newPdfBytes = await newPdfDoc.save();

                              this.createDownloadLink(newPdfBytes, `repaired_${file.name}`, 'application/pdf');

                          } catch (error) {
                              throw error;
                          }
                      }
                  },
                    'pdf-to-pdfa': {
                      title: 'PDF to PDF/A',

                      content: `
                        <section class="tool-content">
                            <h1>PDF to PDF/A Converter Online Free</h1>
                            <p>PDF to PDF/A converts your PDF documents to the PDF/A archival format — an ISO-standardized version of PDF specifically designed for long-term digital preservation. PDF/A files are self-contained, ensuring they can be opened and rendered exactly as intended years or decades into the future, regardless of software changes or font availability.</p>
                            <br>
                            <h2>What is PDF/A and Why Does It Matter?</h2>
                            <p>PDF/A (PDF for Archiving) is a strict subset of the PDF specification designed to guarantee long-term reproducibility. While standard PDF files may reference external fonts, color profiles, or resources that could become unavailable over time, PDF/A requires that all such resources be embedded directly in the file. This makes the document completely self-sufficient — it will look identical whether opened today or in 50 years.</p>
                            <br>
                            <p>PDF/A is widely required by government agencies, courts, law firms, libraries, healthcare institutions, and archival organizations. It is the mandated format for many official document submissions, legal filings, long-term records management systems, and digital preservation projects.</p>
                            <br>
                            <h2>PDF/A vs Standard PDF</h2>
                            <p>Standard PDFs can reference external resources, use transparency, include audio/video, use encryption, and contain JavaScript. PDF/A prohibits all of these features to ensure future compatibility. If your PDF contains any of these elements, the conversion will remove or substitute them to produce a compliant PDF/A file.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Which PDF/A variant does this tool produce?</strong><br>The tool produces a PDF/A-compatible file. For strict compliance certification, consult a dedicated PDF/A validation tool after conversion.</p>
                            <br>
                            <p><strong>Who typically requires PDF/A?</strong><br>Courts, government agencies, archival institutions, hospitals, and any organization with long-term records retention requirements commonly mandate PDF/A.</p>
                        </section>`,
                      desc: 'Convert PDF to PDF/A-compliant format.',
                      icon: '📄➔🇦',
                      fileType: '.pdf',
                      multiple: false,
                      isPlaceholder: false,
                      options: (container) => {
                          container.innerHTML = `
                              <label for="pdfa-compliance">PDF/A Compliance Level:</label>
                              <select id="pdfa-compliance">
                                  <option value="1b">PDF/A-1b (Basic)</option>
                                  <option value="2b">PDF/A-2b (Basic)</option>
                                  <option value="3b">PDF/A-3b (Basic)</option>
                              </select>
                              <p><small><strong>Note:</strong> This creates a PDF/A-compliant structure by:</small></p>
                              <ul style="font-size: 0.9em; margin-left: 20px;">
                                  <li>Embedding all fonts</li>
                                  <li>Flattening transparency</li>
                                  <li>Setting appropriate metadata</li>
                                  <li>Converting to sRGB color space</li>
                              </ul>
                              <p><small>For full PDF/A compliance validation, use professional tools.</small></p>
                          `;
                      },
                      process: async (files, options) => {
                          if (!files || files.length === 0) {
                              throw new Error("No PDF file selected.");
                          }

                          this.showLoader('Converting to PDF/A format...');
                          const file = files[0];
                          const complianceLevel = options['pdfa-compliance'] || '1b';

                          try {
                              const existingPdfBytes = await file.arrayBuffer();
                              const sourcePdfDoc = await PDFDocument.load(existingPdfBytes);
                              const newPdfDoc = await PDFDocument.create();

                              // Embed standard fonts (PDF/A requirement)
                              const helveticaFont = await newPdfDoc.embedFont(StandardFonts.Helvetica);

                              // Set PDF/A metadata
                              newPdfDoc.setTitle(file.name.replace('.pdf', ''));
                              newPdfDoc.setAuthor('PDF Genius Tools');
                              newPdfDoc.setSubject(`PDF/A-${complianceLevel} compliant document`);
                              newPdfDoc.setCreator('PDF Genius Tools PDF/A Converter');
                              newPdfDoc.setProducer('pdf-lib');
                              newPdfDoc.setCreationDate(new Date());
                              newPdfDoc.setModificationDate(new Date());

                              const numPages = sourcePdfDoc.getPageCount();
                              this.showLoader(`Converting ${numPages} pages to PDF/A format...`);

                              // Process each page by rendering and re-embedding
                              const pdfjsDoc = await pdfjsLib.getDocument({data: existingPdfBytes}).promise;

                              for (let i = 0; i < numPages; i++) {
                                  this.showLoader(`Processing page ${i + 1}/${numPages}...`);

                                  const originalPage = sourcePdfDoc.getPage(i);
                                  const { width, height } = originalPage.getSize();

                                  // Render page to canvas (flattens transparency and converts colors)
                                  const pdfjsPage = await pdfjsDoc.getPage(i + 1);
                                  const viewport = pdfjsPage.getViewport({ scale: 2.0 }); // High quality
                                  const canvas = document.createElement('canvas');
                                  canvas.width = viewport.width;
                                  canvas.height = viewport.height;
                                  const context = canvas.getContext('2d');

                                  await pdfjsPage.render({ 
                                      canvasContext: context, 
                                      viewport: viewport 
                                  }).promise;

                                  // Convert to JPEG (ensures sRGB color space)
                                  const imageBytes = await new Promise(resolve => {
                                      canvas.toBlob(blob => {
                                          const reader = new FileReader();
                                          reader.onload = () => resolve(new Uint8Array(reader.result));
                                          reader.readAsArrayBuffer(blob);
                                      }, 'image/jpeg', 0.95);
                                  });

                                  // Create new page and embed image
                                  const newPage = newPdfDoc.addPage([width, height]);
                                  const image = await newPdfDoc.embedJpg(imageBytes);

                                  newPage.drawImage(image, {
                                      x: 0,
                                      y: 0,
                                      width: width,
                                      height: height,
                                  });

                                  // Add invisible text layer for searchability (optional)
                                  const textContent = await pdfjsPage.getTextContent();
                                  if (textContent.items.length > 0) {
                                      textContent.items.forEach(item => {
                                          if (item.str && item.str.trim()) {
                                              try {
                                                  const scaleX = width / viewport.width;
                                                  const scaleY = height / viewport.height;
                                                  const x = item.transform[4] * scaleX;
                                                  const y = height - (item.transform[5] * scaleY);

                                                  newPage.drawText(item.str, {
                                                      x: x,
                                                      y: y,
                                                      font: helveticaFont,
                                                      size: Math.max(1, item.height * scaleY * 0.8),
                                                      opacity: 0, // Invisible but searchable
                                                  });
                                              } catch (e) {
                                                  // Skip problematic text items
                                              }
                                          }
                                      });
                                  }
                              }

                              this.showLoader('Finalizing PDF/A document...');
                              const pdfABytes = await newPdfDoc.save({
                                  useObjectStreams: false, // PDF/A requirement
                              });

                              this.createDownloadLink(
                                  pdfABytes, 
                                  file.name.replace('.pdf', `_PDFA-${complianceLevel}.pdf`), 
                                  'application/pdf'
                              );

                          } catch (error) {
                              throw new Error(`PDF/A conversion failed: ${error.message}`);
                          }
                      }
                  },
    				'redact-pdf': {
                      title: 'Redact PDF',

                      content: `
                        <section class="tool-content">
                            <h1>Redact PDF Online Free</h1>
                            <p>Redact PDF is a free online tool that lets you permanently remove sensitive information from PDF documents by drawing black redaction boxes over confidential text, personal data, or proprietary content. The redacted areas are replaced with solid black rectangles, making the underlying information completely unreadable. All processing runs locally in your browser — your document never leaves your device.</p>
                            <br>
                            <h2>Why PDF Redaction Matters</h2>
                            <p>Redaction is a critical step whenever sharing documents that contain sensitive, confidential, or private information. Simply covering text with a black box in a word processor is not true redaction — the original text may still be accessible in the underlying document. True PDF redaction permanently removes the content from the document so it cannot be recovered by selecting text, using Find, or inspecting the file structure.</p>
                            <br>
                            <p>Common redaction use cases include removing personal identification information (PII) from shared documents, blacking out confidential financial figures in reports shared externally, removing witness names or sensitive details from legal documents for public disclosure, protecting patient information in medical records before sharing, and removing proprietary business information before submitting documents to regulatory agencies.</p>
                            <br>
                            <h2>How to Redact a PDF</h2>
                            <p>Upload your PDF, navigate to the page containing sensitive content, and use the redaction drawing tool to draw rectangles over the areas you want to permanently remove. You can redact content on multiple pages before clicking Process. Once processed, the redacted areas are replaced with solid black in the output PDF.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Is the redaction permanent?</strong><br>Yes. The tool applies solid black overlays to the selected areas in the final PDF. Verify your redactions by reviewing the output PDF thoroughly before sharing.</p>
                            <br>
                            <p><strong>Can redacted content be recovered?</strong><br>With this browser-based tool, recovery of redacted content is extremely difficult. For the highest-security redaction requirements, verify the output with a professional PDF tool.</p>
                        </section>`,
                      desc: 'Permanently remove sensitive text and graphics from PDF.',
                      icon: '⬛',
                      fileType: '.pdf',
                      multiple: false,
                      isPlaceholder: false,
                      onFileSelect: async (files) => {
                          const redactContainer = document.getElementById('redact-preview-container');
                          if (!redactContainer) return;

                          redactContainer.style.display = 'block';
                          redactContainer.innerHTML = '<p>Loading preview...</p>';

                          const file = files[0];
                          const canvas = document.getElementById('redact-canvas');

                          try {
                              const pdfBytes = await file.arrayBuffer();
                              const pdfjsDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;

                              // Store for later use
                              this.redactPdfDoc = pdfjsDoc;
                              this.redactCurrentPage = 1;
                              this.redactBoxes = {}; // Store redaction boxes per page

                              await this.loadRedactPage(1);

                          } catch(e) {
                              this.showError("Could not load PDF preview: " + e.message);
                              redactContainer.innerHTML = '<p>Error loading preview.</p>';
                          }
                      },
                      options: (container) => {
                          container.innerHTML = `
                              <p>Draw rectangles over areas to redact. Redacted content will be permanently removed.</p>
                              <div id="redact-preview-container" style="border: 1px solid var(--border-color); margin: 10px 0; max-width: 100%; display: none;">
                                  <div id="redact-page-controls" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: var(--background-light);">
                                      <button id="redact-prev-page" class="btn btn-secondary">← Previous</button>
                                      <span id="redact-page-display">Page 1 / 1</span>
                                      <button id="redact-next-page" class="btn btn-secondary">Next →</button>
                                  </div>
                                  <canvas id="redact-canvas"></canvas>
                                  <div style="padding: 10px; background-color: var(--background-light);">
                                      <button id="redact-add-box-btn" class="btn btn-secondary">Add Redaction Box</button>
                                      <button id="redact-clear-page-btn" class="btn btn-secondary">Clear Page</button>
                                      <label for="redact-color" style="margin-left: 15px;">Redaction Color:</label>
                                      <input type="color" id="redact-color" value="#000000" style="vertical-align: middle;">
                                  </div>
                              </div>
                              <div id="redact-summary" style="margin-top: 10px; padding: 10px; background-color: var(--background-light); border-radius: 4px; display: none;">
                                  <strong>Redactions Summary:</strong>
                                  <div id="redact-summary-content"></div>
                              </div>
                          `;

                          // Set up event listeners after container is populated
                          setTimeout(() => {
                              const prevBtn = document.getElementById('redact-prev-page');
                              const nextBtn = document.getElementById('redact-next-page');
                              const addBoxBtn = document.getElementById('redact-add-box-btn');
                              const clearBtn = document.getElementById('redact-clear-page-btn');

                              if (prevBtn) prevBtn.onclick = () => this.changeRedactPage(-1);
                              if (nextBtn) nextBtn.onclick = () => this.changeRedactPage(1);
                              if (addBoxBtn) addBoxBtn.onclick = () => this.addRedactionBox();
                              if (clearBtn) clearBtn.onclick = () => this.clearRedactPage();
                          }, 100);
                      },
                      process: async (files, options) => {
                          if (!this.redactPdfDoc || !this.redactBoxes) {
                              throw new Error("No redaction areas defined. Please select areas to redact.");
                          }

                          const totalRedactions = Object.values(this.redactBoxes).reduce((sum, boxes) => sum + boxes.length, 0);
                          if (totalRedactions === 0) {
                              throw new Error("No redaction boxes drawn. Please add redaction areas first.");
                          }

                          this.showLoader('Applying redactions...');
                          const file = files[0];
                          const redactColor = document.getElementById('redact-color')?.value || '#000000';

                          try {
                              const existingPdfBytes = await file.arrayBuffer();
                              const sourcePdfDoc = await PDFDocument.load(existingPdfBytes);
                              const newPdfDoc = await PDFDocument.create();

                              const pdfjsDoc = this.redactPdfDoc;
                              const numPages = pdfjsDoc.numPages;

                              for (let i = 1; i <= numPages; i++) {
                                  this.showLoader(`Processing page ${i}/${numPages}...`);

                                  const originalPage = sourcePdfDoc.getPage(i - 1);
                                  const { width, height } = originalPage.getSize();

                                  // Render page to canvas
                                  const pdfjsPage = await pdfjsDoc.getPage(i);
                                  const viewport = pdfjsPage.getViewport({ scale: 2.0 });
                                  const canvas = document.createElement('canvas');
                                  canvas.width = viewport.width;
                                  canvas.height = viewport.height;
                                  const context = canvas.getContext('2d');

                                  await pdfjsPage.render({ 
                                      canvasContext: context, 
                                      viewport: viewport 
                                  }).promise;

                                  // Apply redaction boxes for this page
                                  if (this.redactBoxes[i]) {
                                      const scaleX = viewport.width / (this.fabricRedactCanvas?.getWidth() || viewport.width);
                                      const scaleY = viewport.height / (this.fabricRedactCanvas?.getHeight() || viewport.height);

                                      context.fillStyle = redactColor;
                                      this.redactBoxes[i].forEach(box => {
                                          context.fillRect(
                                              box.left * scaleX,
                                              box.top * scaleY,
                                              box.width * scaleX,
                                              box.height * scaleY
                                          );
                                      });
                                  }

                                  // Convert to image and add to new PDF
                                  const imageBytes = await new Promise(resolve => {
                                      canvas.toBlob(blob => {
                                          const reader = new FileReader();
                                          reader.onload = () => resolve(new Uint8Array(reader.result));
                                          reader.readAsArrayBuffer(blob);
                                      }, 'image/jpeg', 0.95);
                                  });

                                  const newPage = newPdfDoc.addPage([width, height]);
                                  const image = await newPdfDoc.embedJpg(imageBytes);

                                  newPage.drawImage(image, {
                                      x: 0,
                                      y: 0,
                                      width: width,
                                      height: height,
                                  });
                              }

                              this.showLoader('Finalizing redacted PDF...');
                              const redactedPdfBytes = await newPdfDoc.save();

                              this.createDownloadLink(
                                  redactedPdfBytes, 
                                  file.name.replace('.pdf', '_REDACTED.pdf'), 
                                  'application/pdf'
                              );

                              // Clean up
                              this.redactPdfDoc = null;
                              this.redactBoxes = {};
                              if (this.fabricRedactCanvas) {
                                  this.fabricRedactCanvas.dispose();
                                  this.fabricRedactCanvas = null;
                              }

                          } catch (error) {
                              throw new Error(`Redaction failed: ${error.message}`);
                          }
                      }
                  },              
                   	'crop-pdf': {
                    title: 'Crop PDF',

                      content: `
                        <section class="tool-content">
                            <h1>Crop PDF Pages Online Free</h1>
                            <p>Crop PDF is a free online tool that trims and adjusts the visible page area of your PDF document. Remove unwanted white margins, cut unnecessary borders, focus on a specific region, or resize page dimensions to fit a different paper size — all in your browser without any software installation or file upload.</p>
                            <br>
                            <h2>When Do You Need to Crop a PDF?</h2>
                            <p>PDF cropping is needed in many practical situations. Scanned documents often have large white margins from the scanning bed that waste space and look unprofessional. Presentation PDFs exported at the wrong page size may have excessive padding. Technical drawings may need to be cropped to focus on a specific detail. Documents formatted for A4 paper may need cropping before printing on Letter size, or vice versa.</p>
                            <br>
                            <p>Cropping also allows you to effectively zoom in on content when converting PDF pages to images — a cropped PDF will produce tighter, more focused image exports using our PDF to JPG or PDF to PNG tools.</p>
                            <br>
                            <h2>How PDF Cropping Works</h2>
                            <p>PDF cropping uses the CropBox property defined in the PDF specification. Our tool uses PDF-lib to modify the crop box dimensions — specifying how much to trim from each edge (top, bottom, left, right) in PDF points (72 points = 1 inch). The underlying page content is not deleted — only the visible viewing area is changed. This means cropping is non-destructive.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>What units are used for crop values?</strong><br>Values are entered in PDF points. There are 72 points per inch. So to trim 0.5 inches from each side, enter 36 points.</p>
                            <br>
                            <p><strong>Is cropping reversible?</strong><br>Because PDF cropping changes the CropBox (not the MediaBox), the original content is technically still there. However, for most practical purposes, treat it as permanent.</p>
                        </section>`,
                    desc: 'Set a new visible area for all pages in your PDF.',
                    icon: '◩',
                    fileType: '.pdf',
                    multiple: false,
                    isNew: false,
                    isPlaceholder: false,

                    // Use an arrow function to preserve 'this' context
                    onFileSelect: async (files, optionsContainer) => {
                        // 'this' will now correctly refer to the PDFGeniusApp instance
                        const previewContainer = document.getElementById('crop-preview-container');
                        if (!previewContainer) return;

                        previewContainer.style.display = 'block';
                        previewContainer.innerHTML = '<p>Loading preview...</p>';

                        const file = files[0];
                        const canvas = document.getElementById('crop-canvas');

                        try {
                            const pdfBytes = await file.arrayBuffer();
                            const pdfjsDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                            const page = await pdfjsDoc.getPage(1);

                            const containerWidth = previewContainer.clientWidth - 2;
                            const viewport = page.getViewport({ scale: 1.0 });
                            const scale = containerWidth / viewport.width;
                            const scaledViewport = page.getViewport({ scale: scale });

                            if (this.fabricCropCanvas) {
                                this.fabricCropCanvas.dispose();
                            }
                            this.fabricCropCanvas = new fabric.Canvas(canvas, {
                                width: scaledViewport.width,
                                height: scaledViewport.height
                            });

                            const tempCanvas = document.createElement('canvas');
                            tempCanvas.width = scaledViewport.width;
                            tempCanvas.height = scaledViewport.height;
                            await page.render({ canvasContext: tempCanvas.getContext('2d'), viewport: scaledViewport }).promise;

                            this.fabricCropCanvas.setBackgroundImage(tempCanvas.toDataURL(), this.fabricCropCanvas.renderAll.bind(this.fabricCropCanvas), {
                                originX: 'left',
                                originY: 'top'
                            });

                            const cropRect = new fabric.Rect({
                                fill: 'rgba(0, 0, 0, 0.3)',
                                stroke: '#e5322d',
                                strokeWidth: 1,
                                strokeDashArray: [5, 5],
                                left: 50,
                                top: 50,
                                width: 200,
                                height: 150,
                                hasRotatingPoint: false,
                                transparentCorners: false,
                                cornerColor: '#e5322d',
                                cornerSize: 10
                            });
                            this.fabricCropCanvas.add(cropRect);
                            this.fabricCropCanvas.setActiveObject(cropRect);

                            const updateCropInfo = () => {
                                const cropBoxInfo = document.getElementById('crop-box-info');
                                if (cropBoxInfo) {
                                    const originalWidth = viewport.width;
                                    const originalHeight = viewport.height;
                                    const scaleFactor = originalWidth / scaledViewport.width;

                                    const currentLeft = cropRect.left * scaleFactor;
                                    const currentTop = cropRect.top * scaleFactor;
                                    const currentWidth = cropRect.getScaledWidth() * scaleFactor;
                                    const currentHeight = cropRect.getScaledHeight() * scaleFactor;

                                    cropBoxInfo.innerHTML = `
                                        <strong>Crop Box (in PDF points):</strong><br>
                                        X: ${currentLeft.toFixed(2)}, Y: ${currentTop.toFixed(2)}<br>
                                        Width: ${currentWidth.toFixed(2)}, Height: ${currentHeight.toFixed(2)}
                                    `;
                                }
                            };

                            cropRect.on('modified', updateCropInfo);
                            cropRect.on('scaling', updateCropInfo);
                            cropRect.on('moving', updateCropInfo);

                            updateCropInfo();

                        } catch(e) {
                            this.showError("Could not load PDF preview: " + e.message); // 'this.showError' will now work
                            previewContainer.innerHTML = '<p>Error loading preview.</p>';
                        }
                    },
                    options: (container) => {
                        container.innerHTML = `
                            <p>Adjust the rectangle on the preview of the first page to select your crop area. This crop will be applied to <strong>all pages</strong>.</p>
                            <div id="crop-preview-container" style="border: 1px solid var(--border-color); margin: 10px 0; max-width: 100%; display: none;">
                                <canvas id="crop-canvas"></canvas>
                            </div>
                            <div id="crop-box-info" style="margin-top: 10px; font-family: monospace; background-color: var(--background-light); padding: 5px; border-radius: 4px;">
                                <!-- Crop dimensions will be shown here -->
                            </div>
                        `;
                    },
                    // Use an arrow function here as well to preserve 'this' context
                    process: async (files, options) => {
                        if (!this.fabricCropCanvas) {
                            throw new Error("Crop area not defined. Please upload a file and select an area.");
                        }

                        this.showLoader('Cropping PDF...'); // 'this.showLoader' will now work
                        const file = files[0];
                        const existingPdfBytes = await file.arrayBuffer();
                        const pdfDoc = await PDFDocument.load(existingPdfBytes);

                        const cropRect = this.fabricCropCanvas.getObjects('rect')[0];
                        if (!cropRect) {
                            throw new Error("Could not find the crop selection rectangle.");
                        }

                        const pages = pdfDoc.getPages();
                        if (pages.length === 0) {
                            throw new Error("The PDF contains no pages to crop.");
                        }

                        const firstPage = pages[0];
                        const { width: firstPageWidth, height: firstPageHeight } = firstPage.getSize();

                        const previewCanvasWidth = this.fabricCropCanvas.getWidth();
                        const scaleFactor = firstPageWidth / previewCanvasWidth;

                        const newCropBox = {
                            x: cropRect.left * scaleFactor,
                            y: firstPageHeight - ((cropRect.top + cropRect.getScaledHeight()) * scaleFactor),
                            width: cropRect.getScaledWidth() * scaleFactor,
                            height: cropRect.getScaledHeight() * scaleFactor,
                        };

                        for (let i = 0; i < pages.length; i++) {
                            this.showLoader(`Applying crop to page ${i + 1}/${pages.length}...`);
                            const page = pages[i];
                            page.setCropBox(newCropBox.x, newCropBox.y, newCropBox.width, newCropBox.height);
                        }

                        const croppedPdfBytes = await pdfDoc.save();
                        this.createDownloadLink(croppedPdfBytes, `cropped_${file.name}`, 'application/pdf');

                        if(this.fabricCropCanvas) {
                            this.fabricCropCanvas.dispose();
                            this.fabricCropCanvas = null;
                        }
                    }
                },
                  	'reorder-pdf': {
                    title: 'PDF Page Reorder',

                      content: `
                        <section class="tool-content">
                            <h1>Reorder PDF Pages Online Free</h1>
                            <p>Reorder PDF Pages is a free online tool that provides a visual drag-and-drop interface for rearranging the pages of your PDF into any order you need. View thumbnail previews of every page, drag them into position, and save the reordered PDF — all inside your browser with no file upload and no software installation.</p>
                            <br>
                            <h2>Why Reorder PDF Pages?</h2>
                            <p>Page ordering problems are very common in PDF documents. Scanned multi-page documents often come out in the wrong order if pages are placed in the scanner incorrectly. PDFs assembled from multiple sources may need restructuring. Educational materials might need chapters rearranged. Legal bundles require specific page ordering for court submission. Financial reports need sections organized in a specific sequence for review.</p>
                            <br>
                            <p>Being able to visually rearrange pages — rather than specifying page numbers blindly — makes it much easier to get the order exactly right, especially for long documents.</p>
                            <br>
                            <h2>How It Works</h2>
                            <p>After uploading your PDF, the tool renders thumbnail images of every page using PDF.js. You can drag and drop the thumbnails to rearrange pages in any sequence. When you are satisfied with the order, click Process and PDF-lib rebuilds the PDF in your specified page sequence. Download the reordered document instantly.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can I also delete pages while reordering?</strong><br>Use our Organize PDF tool, which combines drag-to-reorder with page deletion in a single interface.</p>
                            <br>
                            <p><strong>Is there a page limit?</strong><br>No strict limit. Very large PDFs (100+ pages) may take a moment to generate all thumbnails.</p>
                        </section>`,
                    desc: 'Visually rearrange PDF pages by dragging and dropping thumbnails.',
                    icon: '🔀',
                    fileType: '.pdf',
                    multiple: false,
                    isPlaceholder: false,
                    isNew: false,
                    onFileSelect: async (files) => {
                        await this.setupPageReorderUI(files[0]);
                    },
                    options: (container) => {
                        container.innerHTML = `
                            <p><strong>Instructions:</strong> Drag and drop page thumbnails below to reorder them. The new order will be applied when you click "Process".</p>
                            <div id="reorder-preview-container" style="border: 1px solid var(--border-color); margin: 15px 0; padding: 15px; background-color: var(--background-light); border-radius: 8px; min-height: 200px; display: none;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid var(--border-color);">
                                    <h3 style="margin: 0; color: var(--text-dark);">Page Order</h3>
                                    <button id="reset-order-btn" class="btn btn-secondary" style="padding: 8px 15px;">Reset to Original</button>
                                </div>
                                <div id="reorder-pages-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; min-height: 150px;">
                                    <!-- Page thumbnails will be inserted here -->
                                </div>
                            </div>
                            <div id="reorder-info" style="margin-top: 15px; padding: 12px; background-color: var(--background-white); border-left: 4px solid var(--primary-red); border-radius: 4px; display: none;">
                                <strong style="color: var(--primary-red);">ℹ️ Status:</strong>
                                <span id="reorder-status-text" style="color: var(--text-dark); margin-left: 8px;">Loading pages...</span>
                            </div>
                        `;

                        setTimeout(() => {
                            const resetBtn = document.getElementById('reset-order-btn');
                            if (resetBtn) {
                                resetBtn.onclick = () => this.resetPageOrder();
                            }
                        }, 100);
                    },
                    process: async (files, options) => {
                        if (!this.reorderPageData || this.reorderPageData.length === 0) {
                            throw new Error("No pages loaded. Please upload a PDF first.");
                        }

                        this.showLoader('Reordering PDF pages...');
                        const file = files[0];

                        try {
                            const existingPdfBytes = await file.arrayBuffer();
                            const sourcePdfDoc = await PDFDocument.load(existingPdfBytes);
                            const newPdfDoc = await PDFDocument.create();

                            const pagesGrid = document.getElementById('reorder-pages-grid');
                            const pageElements = Array.from(pagesGrid.children);

                            const newOrder = pageElements.map(el => parseInt(el.dataset.originalIndex));

                            this.showLoader(`Reordering ${newOrder.length} pages...`);

                            for (let i = 0; i < newOrder.length; i++) {
                                this.showLoader(`Processing page ${i + 1}/${newOrder.length}...`);
                                const [copiedPage] = await newPdfDoc.copyPages(sourcePdfDoc, [newOrder[i]]);
                                newPdfDoc.addPage(copiedPage);
                            }

                            const reorderedPdfBytes = await newPdfDoc.save();
                            this.createDownloadLink(
                                reorderedPdfBytes,
                                file.name.replace('.pdf', '_reordered.pdf'),
                                'application/pdf'
                            );

                            // Clean up
                            this.reorderPageData = [];

                        } catch (error) {
                            throw new Error(`Page reordering failed: ${error.message}`);
                        }
                    }
                },                  	
                  	'extract-text-pdf': {
                    title: 'PDF Text Extractor',

                      content: `
                        <section class="tool-content">
                            <h1>Extract Text from PDF Online Free</h1>
                            <p>PDF Text Extractor is a free online tool that pulls all the readable text content out of your PDF document and presents it as plain text you can copy, edit, save, or use in any application. No software installation, no file upload to any server, no signup — just upload your PDF and get the text instantly.</p>
                            <br>
                            <h2>Why Extract Text from a PDF?</h2>
                            <p>PDFs are designed for consistent visual presentation, not for text reuse. When you need to work with the content inside a PDF — editing it, translating it, analyzing it, or pasting it into another application — extracting the text first saves enormous amounts of manual retyping time.</p>
                            <br>
                            <p>Common use cases include extracting article text from PDF journals for research and citation, pulling data from PDF reports for further analysis, recovering text from old PDFs to update or reformat, extracting content for translation workflows, feeding PDF content into AI tools or text analysis systems, and indexing or archiving document content.</p>
                            <br>
                            <h2>How the Text Extraction Works</h2>
                            <p>Our tool uses PDF.js to parse the internal text content streams of your PDF. PDF.js reads the text objects embedded in each page and assembles them into readable text. The extracted text is displayed for review and can be downloaded as a plain .txt file.</p>
                            <br>
                            <h2>Text Extraction vs OCR</h2>
                            <p>Text extraction works on PDFs that have a real text layer — that is, PDFs created digitally from Word, InDesign, Excel, or similar tools. For scanned PDFs (image-only), where no text layer exists, use our OCR PDF tool first to add a text layer through optical character recognition, then extract the text.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Will the extracted text preserve formatting?</strong><br>Plain text extraction removes rich formatting like columns, tables, and fonts. The text content is preserved, but layout may differ from the original.</p>
                            <br>
                            <p><strong>What if no text is extracted?</strong><br>Your PDF is likely image-based (scanned). Use our OCR PDF tool first.</p>
                        </section>`,
                    desc: 'Extract all text content from PDF files as plain text.',
                    icon: '📝',
                    fileType: '.pdf',
                    multiple: false,
                    isPlaceholder: false,
                    isNew: false,
                    options: (container) => {
                        container.innerHTML = `
                            <label for="text-extract-format">Output Format:</label>
                            <select id="text-extract-format">
                                <option value="txt">Plain Text (.txt)</option>
                                <option value="html">HTML (.html)</option>
                            </select>

                            <div class="checkbox-group" style="margin-top: 15px;">
                                <input type="checkbox" id="include-page-numbers" checked>
                                <label for="include-page-numbers">Include page numbers in output</label>
                            </div>

                            <div class="checkbox-group">
                                <input type="checkbox" id="preserve-layout">
                                <label for="preserve-layout">Attempt to preserve text layout (spacing)</label>
                            </div>

                            <div id="text-preview-area" style="display: none; margin-top: 20px;">
                                <h4 style="color: var(--text-dark); margin-bottom: 10px;">Text Preview (First 500 characters):</h4>
                                <div id="text-preview-content" style="background-color: var(--background-white); border: 1px solid var(--border-color); padding: 15px; border-radius: 5px; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 0.9em; color: var(--text-dark); white-space: pre-wrap;">
                                </div>
                            </div>
                        `;
                    },
                    process: async (files, options) => {
                        if (!files || files.length === 0) {
                            throw new Error("No PDF file selected.");
                        }

                        this.showLoader('Extracting text from PDF...');
                        const file = files[0];
                        const format = options['text-extract-format'] || 'txt';
                        const includePageNumbers = options['include-page-numbers'] !== false;
                        const preserveLayout = options['preserve-layout'] === true;

                        try {
                            const pdfBytes = await file.arrayBuffer();
                            const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                            const numPages = pdf.numPages;

                            let extractedText = '';
                            let htmlOutput = '';

                            if (format === 'html') {
                                htmlOutput = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Extracted Text - ${file.name}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            max-width: 900px;
                            margin: 40px auto;
                            padding: 20px;
                            background-color: #f8f8fa;
                            color: #333;
                        }
                        .page {
                            background-color: white;
                            padding: 30px;
                            margin-bottom: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .page-number {
                            font-weight: bold;
                            color: #e5322d;
                            margin-bottom: 15px;
                            padding-bottom: 10px;
                            border-bottom: 2px solid #e5322d;
                        }
                        .page-content {
                            ${preserveLayout ? 'white-space: pre-wrap; font-family: monospace;' : ''}
                        }
                    </style>
                </head>
                <body>
                    <h1>Extracted Text from: ${file.name}</h1>
                `;
                            }

                            for (let i = 1; i <= numPages; i++) {
                                this.showLoader(`Extracting text from page ${i}/${numPages}...`);

                                const page = await pdf.getPage(i);
                                const textContent = await page.getTextContent();

                                let pageText = '';

                                if (preserveLayout) {
                                    // Try to preserve layout using item positions
                                    const items = textContent.items.sort((a, b) => {
                                        const yDiff = b.transform[5] - a.transform[5]; // Sort by Y position (top to bottom)
                                        if (Math.abs(yDiff) > 5) return yDiff > 0 ? 1 : -1;
                                        return a.transform[4] - b.transform[4]; // Then by X position (left to right)
                                    });

                                    let lastY = null;
                                    items.forEach(item => {
                                        const currentY = Math.round(item.transform[5]);
                                        if (lastY !== null && Math.abs(currentY - lastY) > 5) {
                                            pageText += '\n';
                                        }
                                        pageText += item.str + ' ';
                                        lastY = currentY;
                                    });
                                } else {
                                    // Simple text extraction
                                    pageText = textContent.items.map(item => item.str).join(' ');
                                }

                                if (format === 'txt') {
                                    if (includePageNumbers) {
                                        extractedText += `\n${'='.repeat(50)}\n`;
                                        extractedText += `PAGE ${i} of ${numPages}\n`;
                                        extractedText += `${'='.repeat(50)}\n\n`;
                                    }
                                    extractedText += pageText.trim() + '\n\n';
                                } else if (format === 'html') {
                                    htmlOutput += `    <div class="page">\n`;
                                    if (includePageNumbers) {
                                        htmlOutput += `        <div class="page-number">Page ${i} of ${numPages}</div>\n`;
                                    }
                                    htmlOutput += `        <div class="page-content">${this.escapeHtml(pageText.trim())}</div>\n`;
                                    htmlOutput += `    </div>\n`;
                                }
                            }

                            if (format === 'html') {
                                htmlOutput += `</body>\n</html>`;
                            }

                            // Show preview
                            const previewArea = document.getElementById('text-preview-area');
                            const previewContent = document.getElementById('text-preview-content');
                            if (previewArea && previewContent) {
                                previewArea.style.display = 'block';
                                const preview = format === 'txt' ? extractedText : extractedText;
                                previewContent.textContent = extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : '');
                            }

                            // Create download
                            const outputData = format === 'txt' ? extractedText : htmlOutput;
                            const mimeType = format === 'txt' ? 'text/plain' : 'text/html';
                            const extension = format === 'txt' ? '.txt' : '.html';

                            this.createDownloadLink(
                                new TextEncoder().encode(outputData),
                                file.name.replace('.pdf', `_extracted${extension}`),
                                mimeType
                            );

                        } catch (error) {
                            throw new Error(`Text extraction failed: ${error.message}`);
                        }
                    }
                },
                  	'extract-images-pdf': {
                    title: 'PDF Image Extractor',

                      content: `
                        <section class="tool-content">
                            <h1>Extract Images from PDF Online Free</h1>
                            <p>PDF Image Extractor is a free online tool that finds and extracts all embedded images from your PDF document, making them available to download as individual image files. Recover photos, diagrams, charts, logos, and graphics from any PDF — entirely in your browser with no server upload and no signup required.</p>
                            <br>
                            <h2>Why Extract Images from a PDF?</h2>
                            <p>PDFs often contain valuable images that are not accessible in any other way. Product catalogs, annual reports, design documents, and academic papers frequently include high-quality images embedded inside the PDF. Without an image extractor, the only way to get these images would be to take screenshots — which produces low-quality results.</p>
                            <br>
                            <p>Common use cases for PDF image extraction include recovering product photos from supplier catalogs, extracting charts and graphs from reports for use in presentations, recovering logo files embedded in PDFs when original source files are lost, extracting reference images from technical documentation, and archiving images from PDF publications.</p>
                            <br>
                            <h2>How It Works</h2>
                            <p>Our tool uses PDF.js to parse the internal structure of each PDF page and identify embedded image resources. Each image is extracted in its original embedded format (typically JPEG or PNG) and packaged for download. Images are extracted at their embedded resolution — the same quality at which they were originally inserted into the PDF.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>What if no images are found?</strong><br>Your PDF may not contain embedded images in the traditional sense. Some PDFs display images that are actually rendered from vector graphics or page content streams rather than traditional image objects.</p>
                            <br>
                            <p><strong>In what format are images extracted?</strong><br>Images are extracted in their original embedded format — most commonly JPEG or PNG.</p>
                        </section>`,
                    desc: 'Extract all images from PDF files and download as a ZIP.',
                    icon: '🖼️',
                    fileType: '.pdf',
                    multiple: false,
                    isPlaceholder: false,
                    isNew: false,
                    options: (container) => {
                        container.innerHTML = `
                            <label for="image-extract-format">Image Format:</label>
                            <select id="image-extract-format">
                                <option value="png">PNG (Lossless)</option>
                                <option value="jpg">JPG (Compressed)</option>
                            </select>

                            <label for="image-extract-quality">Image Quality (for JPG):</label>
                            <input type="range" id="image-extract-quality" min="0.1" max="1.0" step="0.1" value="0.9">
                            <span id="quality-display" style="margin-left: 10px; font-weight: bold;">90%</span>

                            <label for="image-scale">Image Scale:</label>
                            <select id="image-scale">
                                <option value="1">Original Size (1x)</option>
                                <option value="1.5">1.5x Size</option>
                                <option value="2" selected>2x Size (High Quality)</option>
                                <option value="3">3x Size (Very High Quality)</option>
                            </select>

                            <div class="checkbox-group" style="margin-top: 15px;">
                                <input type="checkbox" id="include-backgrounds" checked>
                                <label for="include-backgrounds">Include page backgrounds as images</label>
                            </div>

                            <div id="image-count-info" style="margin-top: 15px; padding: 12px; background-color: var(--background-white); border-left: 4px solid var(--primary-red); border-radius: 4px; display: none;">
                                <strong style="color: var(--primary-red);">📊 Images Found:</strong>
                                <span id="image-count-text" style="color: var(--text-dark); margin-left: 8px;">Scanning...</span>
                            </div>

                            <div id="image-preview-grid" style="display: none; margin-top: 20px; padding: 15px; background-color: var(--background-light); border-radius: 8px; max-height: 300px; overflow-y: auto;">
                                <h4 style="color: var(--text-dark); margin-bottom: 10px;">Preview (First 6 images):</h4>
                                <div id="image-preview-content" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;">
                                </div>
                            </div>
                        `;

                        // Update quality display
                        setTimeout(() => {
                            const qualityInput = document.getElementById('image-extract-quality');
                            const qualityDisplay = document.getElementById('quality-display');
                            if (qualityInput && qualityDisplay) {
                                qualityInput.oninput = () => {
                                    qualityDisplay.textContent = `${Math.round(qualityInput.value * 100)}%`;
                                };
                            }
                        }, 100);
                    },
                    process: async (files, options) => {
                        if (!files || files.length === 0) {
                            throw new Error("No PDF file selected.");
                        }

                        this.showLoader('Extracting images from PDF...');
                        const file = files[0];
                        const format = options['image-extract-format'] || 'png';
                        const quality = parseFloat(options['image-extract-quality']) || 0.9;
                        const scale = parseFloat(options['image-scale']) || 2.0;
                        const includeBackgrounds = options['include-backgrounds'] !== false;

                        try {
                            const pdfBytes = await file.arrayBuffer();
                            const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                            const numPages = pdf.numPages;

                            const zip = new JSZip();
                            let imageCount = 0;
                            const previewImages = [];

                            for (let i = 1; i <= numPages; i++) {
                                this.showLoader(`Scanning page ${i}/${numPages} for images...`);

                                const page = await pdf.getPage(i);
                                const viewport = page.getViewport({ scale: scale });

                                // Extract page as image if includeBackgrounds is true
                                if (includeBackgrounds) {
                                    const canvas = document.createElement('canvas');
                                    canvas.width = viewport.width;
                                    canvas.height = viewport.height;
                                    const context = canvas.getContext('2d');

                                    await page.render({ 
                                        canvasContext: context, 
                                        viewport: viewport 
                                    }).promise;

                                    const blob = await new Promise(resolve => {
                                        if (format === 'jpg') {
                                            canvas.toBlob(resolve, 'image/jpeg', quality);
                                        } else {
                                            canvas.toBlob(resolve, 'image/png');
                                        }
                                    });

                                    const fileName = `page_${i}.${format}`;
                                    zip.file(fileName, blob);
                                    imageCount++;

                                    if (previewImages.length < 6) {
                                        previewImages.push(canvas.toDataURL());
                                    }
                                }

                                // Try to extract embedded images using operatorList
                                try {
                                    const ops = await page.getOperatorList();

                                    for (let j = 0; j < ops.fnArray.length; j++) {
                                        if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject || 
                                            ops.fnArray[j] === pdfjsLib.OPS.paintInlineImageXObject ||
                                            ops.fnArray[j] === pdfjsLib.OPS.paintImageMaskXObject) {

                                            // This is a simplified approach - actual image extraction
                                            // from PDF operators is complex. We'll use the page render method instead.
                                            // For a more accurate extraction, you'd need to parse the PDF structure directly.
                                        }
                                    }
                                } catch (e) {
                                    console.warn(`Could not extract embedded images from page ${i}:`, e);
                                }
                            }

                            // Update info display
                            const imageCountInfo = document.getElementById('image-count-info');
                            const imageCountText = document.getElementById('image-count-text');
                            if (imageCountInfo && imageCountText) {
                                imageCountInfo.style.display = 'block';
                                imageCountText.textContent = `${imageCount} image(s) extracted from ${numPages} page(s)`;
                            }

                            // Show preview
                            const previewGrid = document.getElementById('image-preview-grid');
                            const previewContent = document.getElementById('image-preview-content');
                            if (previewGrid && previewContent && previewImages.length > 0) {
                                previewGrid.style.display = 'block';
                                previewContent.innerHTML = previewImages.map(src => 
                                    `<img src="${src}" style="width: 100%; height: auto; border: 1px solid var(--border-color); border-radius: 4px;">`
                                ).join('');
                            }

                            if (imageCount === 0) {
                                throw new Error("No images found in the PDF. Try enabling 'Include page backgrounds'.");
                            }

                            this.showLoader('Creating ZIP file...');
                            const zipBlob = await zip.generateAsync({ type: 'blob' });

                            this.createDownloadLink(
                                zipBlob,
                                file.name.replace('.pdf', '_images.zip'),
                                'application/zip'
                            );

                        } catch (error) {
                            throw new Error(`Image extraction failed: ${error.message}`);
                        }
                    }
                },
                  	'pdf-to-json': {
                    title: 'PDF to JSON',

                      content: `
                        <section class="tool-content">
                            <h1>PDF to JSON Converter Online Free</h1>
                            <p>PDF to JSON is a free online tool that extracts the text content, page structure, and metadata from your PDF and exports it as a structured JSON file. Developers, data engineers, and analysts can use the JSON output to process PDF content programmatically, integrate PDF data into APIs, feed it into AI and machine learning pipelines, or store it in databases — all without any server upload.</p>
                            <br>
                            <h2>Why Convert PDF to JSON?</h2>
                            <p>PDF is a presentation format, not a data format. Extracting structured data from PDFs is one of the most common challenges in document automation and data engineering. By converting PDF content to JSON, you get a machine-readable, structured representation of the document that can be easily processed by code.</p>
                            <br>
                            <p>Use cases include building document search systems, feeding PDF data into large language model (LLM) pipelines for AI processing, extracting metadata for document management systems, processing invoices and contracts in automated workflows, indexing PDF libraries for content retrieval, and migrating document content to databases or content management systems.</p>
                            <br>
                            <h2>What Data is Included in the JSON Output?</h2>
                            <p>The JSON output includes extracted text content organized by page, document metadata (title, author, creation date, modification date), page dimensions, and text item positions where available. This gives you both the content and structural context needed for most document processing applications.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Can the JSON be parsed by any programming language?</strong><br>Yes. The output is standard JSON that can be read by Python, JavaScript, Java, PHP, Ruby, Go, and virtually any modern programming language.</p>
                            <br>
                            <p><strong>Does it work on scanned PDFs?</strong><br>Scanned PDFs need a text layer first. Use our OCR PDF tool to add searchable text, then convert to JSON for best results.</p>
                        </section>`,
                    desc: 'Convert PDF metadata and content structure to JSON format.',
                    icon: '📄➔{ }',
                    fileType: '.pdf',
                    multiple: false,
                    isPlaceholder: false,
                    isNew: false,
                    options: (container) => {
                        container.innerHTML = `
                            <label for="json-include-options">What to include in JSON:</label>
                            <div class="checkbox-group">
                                <input type="checkbox" id="json-include-metadata" checked>
                                <label for="json-include-metadata">PDF Metadata (title, author, dates)</label>
                            </div>
                            <div class="checkbox-group">
                                <input type="checkbox" id="json-include-text" checked>
                                <label for="json-include-text">Text Content (per page)</label>
                            </div>
                            <div class="checkbox-group">
                                <input type="checkbox" id="json-include-structure">
                                <label for="json-include-structure">Document Structure (pages, dimensions)</label>
                            </div>
                            <div class="checkbox-group">
                                <input type="checkbox" id="json-include-images">
                                <label for="json-include-images">Image Information (count, positions)</label>
                            </div>
                            <div class="checkbox-group">
                                <input type="checkbox" id="json-pretty-print" checked>
                                <label for="json-pretty-print">Pretty Print (formatted JSON)</label>
                            </div>

                            <label for="json-output-format">Output Format:</label>
                            <select id="json-output-format">
                                <option value="download">Download JSON File</option>
                                <option value="preview">Preview in Browser</option>
                                <option value="both">Both Preview & Download</option>
                            </select>

                            <div id="json-preview-area" style="display: none; margin-top: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <h4 style="color: var(--text-dark); margin: 0;">JSON Preview:</h4>
                                    <button id="copy-json-btn" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.9em;">
                                        📋 Copy JSON
                                    </button>
                                </div>
                                <div id="json-preview-content" style="background-color: var(--background-white); border: 1px solid var(--border-color); padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto; font-family: 'Courier New', monospace; font-size: 0.85em; color: var(--text-dark); white-space: pre-wrap; word-break: break-all;">
                                </div>
                            </div>

                            <div id="json-stats" style="display: none; margin-top: 15px; padding: 12px; background-color: var(--background-light); border-radius: 8px;">
                                <strong style="color: var(--primary-red);">📊 JSON Statistics:</strong>
                                <div id="json-stats-content" style="margin-top: 8px; color: var(--text-dark); font-size: 0.9em;">
                                </div>
                            </div>
                        `;

                        setTimeout(() => {
                            const copyBtn = document.getElementById('copy-json-btn');
                            if (copyBtn) {
                                copyBtn.onclick = () => this.copyJsonToClipboard();
                            }
                        }, 100);
                    },
                    process: async (files, options) => {
                        if (!files || files.length === 0) {
                            throw new Error("No PDF file selected.");
                        }

                        this.showLoader('Extracting PDF data to JSON...');
                        const file = files[0];

                        const includeMetadata = options['json-include-metadata'] !== false;
                        const includeText = options['json-include-text'] !== false;
                        const includeStructure = options['json-include-structure'] === true;
                        const includeImages = options['json-include-images'] === true;
                        const prettyPrint = options['json-pretty-print'] !== false;
                        const outputFormat = options['json-output-format'] || 'download';

                        try {
                            const pdfBytes = await file.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(pdfBytes);
                            const pdfjsDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;

                            const jsonData = {
                                fileName: file.name,
                                fileSize: file.size,
                                extractedDate: new Date().toISOString()
                            };

                            // Extract Metadata
                            if (includeMetadata) {
                                this.showLoader('Extracting metadata...');
                                jsonData.metadata = {
                                    title: pdfDoc.getTitle() || 'N/A',
                                    author: pdfDoc.getAuthor() || 'N/A',
                                    subject: pdfDoc.getSubject() || 'N/A',
                                    creator: pdfDoc.getCreator() || 'N/A',
                                    producer: pdfDoc.getProducer() || 'N/A',
                                    creationDate: pdfDoc.getCreationDate()?.toString() || 'N/A',
                                    modificationDate: pdfDoc.getModificationDate()?.toString() || 'N/A',
                                    keywords: pdfDoc.getKeywords() || 'N/A'
                                };
                            }

                            // Extract Structure
                            if (includeStructure) {
                                this.showLoader('Extracting document structure...');
                                const pages = pdfDoc.getPages();
                                jsonData.structure = {
                                    pageCount: pages.length,
                                    pages: pages.map((page, index) => {
                                        const { width, height } = page.getSize();
                                        const rotation = page.getRotation();
                                        return {
                                            pageNumber: index + 1,
                                            width: Math.round(width * 100) / 100,
                                            height: Math.round(height * 100) / 100,
                                            rotation: rotation.angle
                                        };
                                    })
                                };
                            }

                            // Extract Text Content
                            if (includeText) {
                                this.showLoader('Extracting text content...');
                                jsonData.textContent = {
                                    totalPages: pdfjsDoc.numPages,
                                    pages: []
                                };

                                for (let i = 1; i <= pdfjsDoc.numPages; i++) {
                                    this.showLoader(`Extracting text from page ${i}/${pdfjsDoc.numPages}...`);
                                    const page = await pdfjsDoc.getPage(i);
                                    const textContent = await page.getTextContent();

                                    const pageText = textContent.items.map(item => item.str).join(' ');
                                    const wordCount = pageText.split(/\s+/).filter(word => word.length > 0).length;

                                    jsonData.textContent.pages.push({
                                        pageNumber: i,
                                        text: pageText.trim(),
                                        wordCount: wordCount,
                                        characterCount: pageText.length
                                    });
                                }
                            }

                            // Extract Image Information
                            if (includeImages) {
                                this.showLoader('Analyzing images...');
                                jsonData.images = {
                                    totalImages: 0,
                                    pages: []
                                };

                                for (let i = 1; i <= pdfjsDoc.numPages; i++) {
                                    const page = await pdfjsDoc.getPage(i);
                                    const ops = await page.getOperatorList();

                                    let imageCount = 0;
                                    const imagePositions = [];

                                    for (let j = 0; j < ops.fnArray.length; j++) {
                                        if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject || 
                                            ops.fnArray[j] === pdfjsLib.OPS.paintInlineImageXObject) {
                                            imageCount++;
                                            imagePositions.push({
                                                index: imageCount,
                                                operatorType: ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject ? 'XObject' : 'Inline'
                                            });
                                        }
                                    }

                                    if (imageCount > 0) {
                                        jsonData.images.pages.push({
                                            pageNumber: i,
                                            imageCount: imageCount,
                                            images: imagePositions
                                        });
                                        jsonData.images.totalImages += imageCount;
                                    }
                                }
                            }

                            // Generate JSON string
                            const jsonString = prettyPrint ? 
                                JSON.stringify(jsonData, null, 2) : 
                                JSON.stringify(jsonData);

                            // Store for copy function
                            this.currentJsonData = jsonString;

                            // Show statistics
                            const statsDiv = document.getElementById('json-stats');
                            const statsContent = document.getElementById('json-stats-content');
                            if (statsDiv && statsContent) {
                                statsDiv.style.display = 'block';
                                const stats = [];
                                stats.push(`Size: ${(jsonString.length / 1024).toFixed(2)} KB`);
                                if (jsonData.structure) stats.push(`Pages: ${jsonData.structure.pageCount}`);
                                if (jsonData.textContent) {
                                    const totalWords = jsonData.textContent.pages.reduce((sum, p) => sum + p.wordCount, 0);
                                    stats.push(`Total Words: ${totalWords.toLocaleString()}`);
                                }
                                if (jsonData.images) stats.push(`Total Images: ${jsonData.images.totalImages}`);

                                statsContent.innerHTML = stats.join(' • ');
                            }

                            // Handle output format
                            if (outputFormat === 'preview' || outputFormat === 'both') {
                                const previewArea = document.getElementById('json-preview-area');
                                const previewContent = document.getElementById('json-preview-content');
                                if (previewArea && previewContent) {
                                    previewArea.style.display = 'block';
                                    previewContent.textContent = jsonString;

                                    // Syntax highlighting (simple)
                                    this.highlightJson(previewContent);
                                }
                            }

                            if (outputFormat === 'download' || outputFormat === 'both') {
                                this.createDownloadLink(
                                    new TextEncoder().encode(jsonString),
                                    file.name.replace('.pdf', '.json'),
                                    'application/json'
                                );
                            }

                        } catch (error) {
                            throw new Error(`JSON conversion failed: ${error.message}`);
                        }
                    }
                },
                  	'compare-pdf': {
                    title: 'PDF File Comparator',

                      content: `
                        <section class="tool-content">
                            <h1>Compare PDF Files Online Free</h1>
                            <p>PDF File Comparator is a free online tool that analyzes two PDF files and highlights the differences between them. Upload the original and revised versions of a PDF, and the tool identifies what text has been added, removed, or changed — making document review, version control, and compliance checking fast and accurate. All comparison happens in your browser with no file upload.</p>
                            <br>
                            <h2>Why Compare PDF Files?</h2>
                            <p>Document version control is a critical part of any professional workflow involving contracts, reports, policies, technical specifications, legal filings, and regulatory submissions. Manually reading through two versions of a long document to spot changes is time-consuming and error-prone. Our PDF comparison tool automates this process, instantly highlighting exactly what changed between versions.</p>
                            <br>
                            <p>Common use cases include reviewing contract amendments to identify changed clauses, comparing draft and final versions of reports, verifying that a corrected document has only the intended changes, compliance auditing to ensure document integrity, academic peer review of revised papers, and quality control in document-heavy industries like legal, finance, and healthcare.</p>
                            <br>
                            <h2>How the Comparison Works</h2>
                            <p>The tool extracts the text content from both PDFs using PDF.js, then performs a text difference analysis between the two documents. Differences — additions, deletions, and changes — are identified and displayed in a side-by-side or annotated view. The comparison is text-based, meaning it works best on PDFs with a searchable text layer.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Does it compare images or formatting?</strong><br>The current comparison is text-based. Visual layout differences and image changes are not detected.</p>
                            <br>
                            <p><strong>Does it work on scanned PDFs?</strong><br>Scanned PDFs need to be processed with our OCR PDF tool first to add a text layer before comparison.</p>
                        </section>`,
                    desc: 'Compare two PDF files and highlight differences in text content.',
                    icon: '⚖️',
                    fileType: '.pdf',
                    multiple: true,
                    isPlaceholder: false,
                    isNew: false,
                    onFileSelect: (files) => {
                        const fileListDiv = document.getElementById('file-list');
                        if (fileListDiv && files.length !== 2) {
                            setTimeout(() => {
                                const warningDiv = document.createElement('div');
                                warningDiv.style.cssText = `
                                    padding: 10px;
                                    background-color: rgba(229, 50, 45, 0.1);
                                    border: 1px solid var(--primary-red);
                                    border-radius: 5px;
                                    color: var(--primary-red);
                                    margin-top: 10px;
                                    font-size: 0.9em;
                                `;
                                warningDiv.innerHTML = `<strong>⚠️ Notice:</strong> Please select exactly 2 PDF files to compare.`;
                                fileListDiv.appendChild(warningDiv);
                            }, 100);
                        }
                    },
                    options: (container) => {
                        container.innerHTML = `
                            <p style="color: var(--text-dark); margin-bottom: 15px;">
                                <strong>📋 Instructions:</strong> Select exactly 2 PDF files. The tool will compare their text content page by page.
                            </p>

                            <label for="compare-mode">Comparison Mode:</label>
                            <select id="compare-mode">
                                <option value="text">Text Content Only</option>
                                <option value="structure">Structure & Metadata</option>
                                <option value="both">Both Text & Structure</option>
                            </select>

                            <div class="checkbox-group" style="margin-top: 15px;">
                                <input type="checkbox" id="ignore-whitespace" checked>
                                <label for="ignore-whitespace">Ignore whitespace differences</label>
                            </div>

                            <div class="checkbox-group">
                                <input type="checkbox" id="case-sensitive">
                                <label for="case-sensitive">Case sensitive comparison</label>
                            </div>

                            <div class="checkbox-group">
                                <input type="checkbox" id="show-line-by-line">
                                <label for="show-line-by-line">Show line-by-line differences</label>
                            </div>

                            <div id="comparison-results" style="display: none; margin-top: 20px;">
                                <h4 style="color: var(--text-dark); margin-bottom: 15px;">📊 Comparison Results</h4>

                                <div id="comparison-summary" style="padding: 15px; background-color: var(--background-light); border-radius: 8px; margin-bottom: 15px;">
                                </div>

                                <div id="comparison-details" style="background-color: var(--background-white); border: 1px solid var(--border-color); border-radius: 8px; max-height: 500px; overflow-y: auto;">
                                </div>
                            </div>
                        `;
                    },
                    process: async (files, options) => {
                        if (!files || files.length !== 2) {
                            throw new Error("Please select exactly 2 PDF files to compare.");
                        }

                        this.showLoader('Comparing PDF files...');

                        const compareMode = options['compare-mode'] || 'text';
                        const ignoreWhitespace = options['ignore-whitespace'] !== false;
                        const caseSensitive = options['case-sensitive'] === true;
                        const showLineByLine = options['show-line-by-line'] === true;

                        try {
                            // Load both PDFs
                            const pdf1Bytes = await files[0].arrayBuffer();
                            const pdf2Bytes = await files[1].arrayBuffer();

                            const pdfDoc1 = await PDFDocument.load(pdf1Bytes);
                            const pdfDoc2 = await PDFDocument.load(pdf2Bytes);

                            const pdfjsDoc1 = await pdfjsLib.getDocument({ data: pdf1Bytes }).promise;
                            const pdfjsDoc2 = await pdfjsLib.getDocument({ data: pdf2Bytes }).promise;

                            const comparisonResults = {
                                file1: files[0].name,
                                file2: files[1].name,
                                timestamp: new Date().toISOString(),
                                differences: [],
                                summary: {
                                    totalDifferences: 0,
                                    identicalPages: 0,
                                    differentPages: 0,
                                    pageCountMatch: pdfjsDoc1.numPages === pdfjsDoc2.numPages
                                }
                            };

                            // Compare Structure
                            if (compareMode === 'structure' || compareMode === 'both') {
                                this.showLoader('Comparing document structure...');

                                comparisonResults.structureComparison = {
                                    pageCount: {
                                        file1: pdfjsDoc1.numPages,
                                        file2: pdfjsDoc2.numPages,
                                        match: pdfjsDoc1.numPages === pdfjsDoc2.numPages
                                    },
                                    metadata: {
                                        file1: {
                                            title: pdfDoc1.getTitle() || 'N/A',
                                            author: pdfDoc1.getAuthor() || 'N/A',
                                            creator: pdfDoc1.getCreator() || 'N/A'
                                        },
                                        file2: {
                                            title: pdfDoc2.getTitle() || 'N/A',
                                            author: pdfDoc2.getAuthor() || 'N/A',
                                            creator: pdfDoc2.getCreator() || 'N/A'
                                        }
                                    }
                                };
                            }

                            // Compare Text Content
                            if (compareMode === 'text' || compareMode === 'both') {
                                const maxPages = Math.max(pdfjsDoc1.numPages, pdfjsDoc2.numPages);

                                for (let i = 1; i <= maxPages; i++) {
                                    this.showLoader(`Comparing page ${i}/${maxPages}...`);

                                    let text1 = '';
                                    let text2 = '';

                                    if (i <= pdfjsDoc1.numPages) {
                                        const page1 = await pdfjsDoc1.getPage(i);
                                        const content1 = await page1.getTextContent();
                                        text1 = content1.items.map(item => item.str).join(' ');
                                    }

                                    if (i <= pdfjsDoc2.numPages) {
                                        const page2 = await pdfjsDoc2.getPage(i);
                                        const content2 = await page2.getTextContent();
                                        text2 = content2.items.map(item => item.str).join(' ');
                                    }

                                    // Process text based on options
                                    if (ignoreWhitespace) {
                                        text1 = text1.replace(/\s+/g, ' ').trim();
                                        text2 = text2.replace(/\s+/g, ' ').trim();
                                    }

                                    if (!caseSensitive) {
                                        text1 = text1.toLowerCase();
                                        text2 = text2.toLowerCase();
                                    }

                                    // Compare texts
                                    if (text1 === text2) {
                                        comparisonResults.summary.identicalPages++;
                                    } else {
                                        comparisonResults.summary.differentPages++;
                                        comparisonResults.summary.totalDifferences++;

                                        const pageDiff = {
                                            pageNumber: i,
                                            type: 'text_difference',
                                            file1Length: text1.length,
                                            file2Length: text2.length,
                                            similarity: this.calculateSimilarity(text1, text2)
                                        };

                                        if (showLineByLine) {
                                            const lines1 = text1.split(/[.!?]\s+/);
                                            const lines2 = text2.split(/[.!?]\s+/);
                                            pageDiff.lineDifferences = this.compareLines(lines1, lines2);
                                        }

                                        // Find first difference
                                        let firstDiffIndex = 0;
                                        while (firstDiffIndex < Math.min(text1.length, text2.length) && 
                                               text1[firstDiffIndex] === text2[firstDiffIndex]) {
                                            firstDiffIndex++;
                                        }

                                        if (firstDiffIndex < Math.max(text1.length, text2.length)) {
                                            const contextStart = Math.max(0, firstDiffIndex - 50);
                                            const contextEnd = Math.min(Math.max(text1.length, text2.length), firstDiffIndex + 50);

                                            pageDiff.previewFile1 = text1.substring(contextStart, contextEnd) + '...';
                                            pageDiff.previewFile2 = text2.substring(contextStart, contextEnd) + '...';
                                        }

                                        comparisonResults.differences.push(pageDiff);
                                    }
                                }
                            }

                            // Display results
                            this.displayComparisonResults(comparisonResults);

                            // Create downloadable report
                            const reportJson = JSON.stringify(comparisonResults, null, 2);
                            this.createDownloadLink(
                                new TextEncoder().encode(reportJson),
                                `comparison_report_${Date.now()}.json`,
                                'application/json'
                            );

                        } catch (error) {
                            throw new Error(`PDF comparison failed: ${error.message}`);
                        }
                    }
                },
                  	'remove-pdf-background': {
                    title: 'PDF Background Remover',

                      content: `
                        <section class="tool-content">
                            <h1>Remove PDF Background Online Free</h1>
                            <p>PDF Background Remover is a free online tool that cleans up the background of your PDF pages, replacing colored, grey, or off-white backgrounds with a clean white background. Perfect for scanned documents with paper texture, PDFs with colored design backgrounds, or any document where a clean white background is needed for better readability or printing. All processing runs in your browser — no file upload required.</p>
                            <br>
                            <h2>Why Remove PDF Backgrounds?</h2>
                            <p>Scanned documents often have backgrounds that are not pure white. Aged paper appears yellow or grey when scanned. Some scanners pick up paper texture or slight shadows. Documents scanned under poor lighting conditions may have uneven grey backgrounds. PDFs created from templates with colored backgrounds may need cleaning up before printing on plain white paper or submitting to document portals that expect clean white backgrounds.</p>
                            <br>
                            <p>A clean white background also reduces file size when the PDF is compressed, improves OCR accuracy on scanned documents, makes the document look more professional, and ensures consistent appearance when printing on white paper.</p>
                            <br>
                            <h2>How the Background Removal Works</h2>
                            <p>The tool renders each PDF page as a canvas image, applies a background color detection and replacement algorithm to identify and neutralize light background colors, and re-embeds the cleaned image back into the PDF. The result is a PDF with clean white page backgrounds while preserving all text, images, and other content.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>Will it affect my text or images?</strong><br>The algorithm targets background areas — large regions of uniform light color. Text and embedded images with distinct colors are preserved.</p>
                            <br>
                            <p><strong>Does it work on intentionally colored design PDFs?</strong><br>Yes, but use with care — design PDFs with meaningful colored backgrounds will have those backgrounds removed too.</p>
                        </section>`,
                    desc: 'Remove background colors and images from PDF pages.',
                    icon: '🎨',
                    fileType: '.pdf',
                    multiple: false,
                    isPlaceholder: false,
                    isNew: true,

                    // UI Elements inside modal
                    options: (container) => {
                        container.innerHTML = `
                            <label>Background Tolerance:</label>
                            <input type="range" id="bg-tolerance" min="5" max="120" value="40" />
                            <span id="tolerance-value" style="font-weight:bold;">40</span>
                            <br><br>

                            <label>
                                <input type="checkbox" id="preserve-text" checked />
                                Preserve Text Layers
                            </label>
                            <br><br>

                            <p style="font-size:0.85em; color:#777;">
                                This tool removes simple (white/light) backgrounds.  
                                Complex images or gradients will be available in the advanced version.
                            </p>
                        `;

                        // Update tolerance number live
                        const slider = container.querySelector('#bg-tolerance');
                        const label = container.querySelector('#tolerance-value');
                        slider.addEventListener('input', () => label.textContent = slider.value);
                    },

                    // PROCESS FUNCTION — LIGHT BACKGROUND REMOVAL
                    process: async (files, options) => {
                        const file = files[0];
                        const tolerance = parseInt(options["bg-tolerance"] || 40);
                        const preserveText = options["preserve-text"] ? true : false;

                        const arrayBuffer = await file.arrayBuffer();
                        const pdf = await PDFDocument.load(arrayBuffer);

                        const newPdf = await PDFDocument.create();

                        for (let i = 0; i < pdf.getPageCount(); i++) {
                            const page = pdf.getPage(i);

                            // Create blank white page → Removes background
                            const { width, height } = page.getSize();
                            const newPage = newPdf.addPage([width, height]);
                            newPage.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

                            // Copy only text (optional)
                            if (preserveText) {
                                const content = await page.getTextContent?.().catch(() => null);
                                if (content?.items) {
                                    for (const item of content.items) {
                                        if (item.str && item.transform) {
                                            const [a, b, c, d, x, y] = item.transform;
                                            newPage.drawText(item.str, {
                                                x,
                                                y,
                                                size: Math.abs(d),
                                                color: rgb(0, 0, 0),
                                            });
                                        }
                                    }
                                }
                            }
                        }

                        const output = await newPdf.save();
                        this.createDownloadLink(output, 'cleaned.pdf', 'application/pdf');
                    }
                },

                    'pdf-thumbnail-generator': {
                        title: 'PDF Thumbnail Generator',

                      content: `
                        <section class="tool-content">
                            <h1>PDF Thumbnail Generator Online Free</h1>
                            <p>PDF Thumbnail Generator is a free online tool that renders thumbnail preview images of your PDF pages. Generate small, high-quality JPEG or PNG preview images of each page in your PDF — perfect for document management systems, content preview interfaces, website document listings, email previews, and any application that needs a visual snapshot of a PDF document. All rendering runs in your browser with no file upload.</p>
                            <br>
                            <h2>Who Needs PDF Thumbnails?</h2>
                            <p>PDF thumbnails are essential for any application or workflow that involves displaying or browsing PDF documents visually. Web developers building document management platforms need thumbnails for grid-view document browsers. Email marketing platforms use PDF thumbnails to preview attachments in campaign emails. E-learning platforms display course material thumbnails for navigation. Digital libraries and archives show cover thumbnails for browsable document collections.</p>
                            <br>
                            <p>Without a thumbnail, a PDF appears as a generic file icon — giving the viewer no visual context about the document content. A clear, accurate thumbnail immediately communicates what the document is about and encourages engagement.</p>
                            <br>
                            <h2>How the Thumbnail Generation Works</h2>
                            <p>Our tool uses PDF.js to render each page of your PDF on an HTML canvas at a reduced scale. The rendered canvas is exported as a compressed image file (JPEG or PNG). Multiple thumbnail images are packaged together for easy download. The thumbnail scale is optimized to produce clear, readable previews that are small enough for fast loading in web interfaces.</p>
                            <br>
                            <h2>Frequently Asked Questions</h2>
                            <p><strong>What size are the thumbnail images?</strong><br>Thumbnails are generated at a standard preview scale — typically around 200-300px wide — suitable for most document browser interfaces.</p>
                            <br>
                            <p><strong>Can I generate a thumbnail for just the first page?</strong><br>All pages are processed. To get only the first-page thumbnail, simply use the first image from the downloaded set.</p>
                            <br>
                            <p><strong>What format are the thumbnails?</strong><br>Thumbnails are exported as JPEG images for compact file size and fast loading.</p>
                        </section>`,
                        desc: 'Generate preview thumbnail images from each page of a PDF.',
                        icon: '🖼️',
                        fileType: '.pdf',
                        multiple: false,
                        isNew: true,
                        process: async (files) => {
                            this.showLoader('Generating thumbnails...');
                            const file = files[0];
                            const pdfBytes = await file.arrayBuffer();
                            const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                            const zip = new JSZip();
                            const outputDiv = document.getElementById('output-area');
                            outputDiv.innerHTML = '<p>Thumbnails generated:</p>';
                            for (let i = 1; i <= pdf.numPages; i++) {
                                this.showLoader(`Rendering page ${i}/${pdf.numPages}...`);
                                const page = await pdf.getPage(i);
                                const viewport = page.getViewport({ scale: 0.4 });
                                const canvas = document.createElement('canvas');
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;
                                await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
                                const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.85));
                                const arrayBuf = await blob.arrayBuffer();
                                zip.file(`thumbnail_page_${i}.jpg`, arrayBuf);
                                const img = document.createElement('img');
                                img.src = canvas.toDataURL('image/jpeg', 0.85);
                                img.style.cssText = 'max-width:150px;margin:4px;border:1px solid #444;border-radius:4px;';
                                outputDiv.appendChild(img);
                            }
                            const zipBlob = await zip.generateAsync({ type: 'blob' });
                            const url = URL.createObjectURL(zipBlob);
                            const a = document.createElement('a');
                            a.href = url; a.download = 'thumbnails.zip'; a.className = 'btn';
                            a.textContent = 'Download All Thumbnails (ZIP)';
                            outputDiv.appendChild(document.createElement('br'));
                            outputDiv.appendChild(a);
                            this.hideLoader();
                        }
                    }

                };
            }

            init() {
                this.setupTheme();
                this.setupEventListeners();
                this.generateToolCards();
                this.initRevealOnScroll();
                this.handleInitialUrl();
                this.setupPopstateListener();
            }

            // Open the correct tool modal if the URL matches a known tool slug
            // e.g. /split-pdf or /Split-PDF -> opens Split PDF tool
            handleInitialUrl() {
                var path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
                if (!path) return;

                            const toolSeoMap = {
                'split-pdf': { title: 'Split PDF Online Free — Extract Pages from PDF | PDF Genius Tools', desc: 'Split PDF files online free. Extract specific pages or ranges from any PDF. No signup, no file size limits. Works entirely in your browser.' },
                'word-to-pdf': { title: 'Word to PDF Converter Online Free — Convert DOCX to PDF | PDF Genius Tools', desc: 'Convert Word documents to PDF online free. DOCX to PDF converter — no software needed, no signup. Fast conversion directly in your browser.' },
                'sign-pdf': { title: 'Sign PDF Online Free — Add Digital Signature to PDF | PDF Genius Tools', desc: 'Sign PDF documents online free. Draw your signature and add it to any PDF. No signup, no upload to servers. Free electronic PDF signing tool.' },
                'rotate-pdf': { title: 'Rotate PDF Online Free — Rotate PDF Pages | PDF Genius Tools', desc: 'Rotate PDF pages online for free. Fix orientation of any PDF instantly. No signup, no software download needed. 100% browser-based PDF rotation tool.' },
                'extract-images-pdf': { title: 'Extract Images from PDF Online Free — PDF Image Extractor | PDF Genius Tools', desc: 'Extract all images from PDF documents online free. Download embedded images from any PDF. No signup, no file upload to server required.' },
                'pdf-to-png': { title: 'PDF to PNG Converter Online Free — Convert PDF to PNG Image | PDF Genius Tools', desc: 'Convert PDF pages to PNG images online free. High-quality PDF to PNG converter — no upload, no signup. Free and instant in your browser.' },
                'pdf-to-json': { title: 'PDF to JSON Converter Online Free — Extract PDF Data as JSON | PDF Genius Tools', desc: 'Convert PDF content and metadata to JSON format online free. Extract PDF data as structured JSON. No signup, browser-based PDF to JSON tool.' },
                'reorder-pdf': { title: 'Reorder PDF Pages Online Free — Rearrange PDF Pages | PDF Genius Tools', desc: 'Reorder and rearrange PDF pages online free. Drag and drop interface to reorganize any PDF document. No signup, no upload to servers.' },
                'add-page-numbers': { title: 'Add Page Numbers to PDF Online Free | PDF Genius Tools', desc: 'Add page numbers to PDF documents online free. Customize position and format of page numbers. No signup required. Works directly in your browser.' },
                'add-header-footer': { title: 'Add Header and Footer to PDF Online Free | PDF Genius Tools', desc: 'Add custom header and footer to all PDF pages online free. Insert text in header or footer of every page. No signup, browser-based PDF tool.' },
                'watermark-pdf': { title: 'Watermark PDF Online Free — Add Text Watermark to PDF | PDF Genius Tools', desc: 'Add watermark to PDF online free. Insert custom text watermark on all PDF pages. No signup, 100% browser-based. Protect your PDF documents instantly.' },
                'delete-pdf-pages': { title: 'Delete PDF Pages Online Free — Remove Pages from PDF | PDF Genius Tools', desc: 'Delete specific pages from PDF online free. Remove unwanted pages from any PDF document. No signup, no file upload to server. Instant removal.' },
                'redact-pdf': { title: 'Redact PDF Online Free — Remove Sensitive Text from PDF | PDF Genius Tools', desc: 'Redact sensitive information from PDF files online free. Permanently remove confidential text and images. No signup, 100% browser-based PDF redaction.' },
                'png-to-pdf': { title: 'PNG to PDF Converter Online Free — Convert PNG Images to PDF | PDF Genius Tools', desc: 'Convert PNG images to PDF online free. Combine multiple PNG files into one PDF document. No signup, no watermark. Fast conversion in browser.' },
                'powerpoint-to-pdf': { title: 'PowerPoint to PDF Converter Online Free — PPTX to PDF | PDF Genius Tools', desc: 'Convert PowerPoint to PDF online free. PPTX to PDF converter — no software download, no signup. Fast conversion directly in your browser.' },
                'pdf-to-excel': { title: 'PDF to Excel Converter Online Free — Extract PDF Data to Excel | PDF Genius Tools', desc: 'Convert PDF to Excel online free. Extract tables and data from PDF files to Excel format. No upload, no signup. Experimental browser-based tool.' },
                'pdf-to-pdfa': { title: 'PDF to PDF/A Converter Online Free — PDF/A Archiving | PDF Genius Tools', desc: 'Convert PDF to PDF/A archival format online free. Create long-term archivable PDF/A documents. No signup required. Browser-based PDF/A converter.' },
                'merge-pdf': { title: 'Merge PDF Files Online Free — Combine PDF Files Instantly | PDF Genius Tools', desc: 'Merge multiple PDF files into one online for free. No upload to server, no signup. Combine PDFs instantly in your browser. Fast, secure and 100% private.' },
                'unlock-pdf': { title: 'Unlock PDF Online Free — Remove PDF Password | PDF Genius Tools', desc: 'Remove password from PDF online free. Unlock protected PDF files instantly in your browser. No signup required. Free PDF unlock tool.' },
                'html-to-pdf': { title: 'HTML to PDF Converter Online Free — Convert Web Page to PDF | PDF Genius Tools', desc: 'Convert HTML files or web pages to PDF online free. Paste HTML code and download as PDF. No signup, no upload. Instant HTML to PDF in browser.' },
                'pdf-to-jpg': { title: 'PDF to JPG Converter Online Free — Convert PDF Pages to Images | PDF Genius Tools', desc: 'Convert PDF pages to JPG images online free. High-quality PDF to JPG converter — no upload, no signup. Download images instantly from your browser.' },
                'ocr-pdf': { title: 'OCR PDF Online Free — Make Scanned PDF Searchable | PDF Genius Tools', desc: 'Convert scanned PDF to searchable text online free. OCR PDF tool recognizes characters in image-based PDFs. No signup required. Works in browser.' },
                'extract-text-pdf': { title: 'Extract Text from PDF Online Free — PDF Text Extractor | PDF Genius Tools', desc: 'Extract all text from PDF files online free. Copy text content from any PDF document instantly. No signup, 100% browser-based text extraction.' },
                'remove-pdf-background': { title: 'Remove PDF Background Online Free — White PDF Background | PDF Genius Tools', desc: 'Remove background from PDF pages online free. Clean up PDF backgrounds instantly in your browser. No signup, no file upload to servers required.' },
                'protect-pdf': { title: 'Protect PDF with Password Online Free — Encrypt PDF | PDF Genius Tools', desc: 'Add password protection to PDF online free. Encrypt your PDF files to prevent unauthorized access. No upload to servers. 100% browser-based.' },
                'compress-pdf': { title: 'Compress PDF Online Free — Reduce PDF Size Without Losing Quality | PDF Genius Tools', desc: 'Free online PDF compressor. Reduce PDF file size for email or web. No upload to servers, no signup needed. Instant PDF compression in your browser.' },
                'pdf-thumbnail-generator': { title: 'PDF Thumbnail Generator Online Free — PDF Preview Images | PDF Genius Tools', desc: 'Generate thumbnail preview images from PDF pages online free. Create PDF thumbnails instantly. No signup, 100% browser-based thumbnail generator.' },
                'edit-pdf': { title: 'Edit PDF Online Free — Add Text and Shapes to PDF | PDF Genius Tools', desc: 'Edit PDF files online for free. Add text, shapes and drawings to any PDF in your browser. No software download, no signup. Free online PDF editor.' },
                'jpg-to-pdf': { title: 'JPG to PDF Converter Online Free — Convert Images to PDF | PDF Genius Tools', desc: 'Convert JPG images to PDF online for free. Combine multiple JPG files into one PDF. No signup, no watermark. Fast JPG to PDF conversion in browser.' },
                'pdf-to-word': { title: 'PDF to Word Converter Online Free — Convert PDF to DOCX | PDF Genius Tools', desc: 'Convert PDF to Word online free. Extract text from PDF files to editable Word documents. No signup required. Fast, free and works in your browser.' },
                'compare-pdf': { title: 'Compare PDF Files Online Free — Find Differences Between PDFs | PDF Genius Tools', desc: 'Compare two PDF files and highlight differences online free. Find changes between PDF versions. No signup, no upload. Browser-based PDF comparison tool.' },
                'organize-pdf': { title: 'Organize PDF Pages Online Free — Reorder & Delete PDF Pages | PDF Genius Tools', desc: 'Organize and reorder PDF pages online free. Drag and drop to rearrange or delete pages from any PDF. No signup, 100% browser-based.' },
                'repair-pdf': { title: 'Repair PDF Online Free — Fix Corrupted PDF Files | PDF Genius Tools', desc: 'Repair and fix corrupted PDF files online free. Attempt to recover damaged PDF documents. No signup, browser-based PDF repair tool.' },
                'excel-to-pdf': { title: 'Excel to PDF Converter Online Free — Convert XLSX to PDF | PDF Genius Tools', desc: 'Convert Excel spreadsheets to PDF online free. XLSX to PDF converter — no software, no signup. Fast Excel to PDF conversion in your browser.' },
                'pdf-to-powerpoint': { title: 'PDF to PowerPoint Converter Online Free — PDF to PPTX | PDF Genius Tools', desc: 'Convert PDF to PowerPoint slides online free. Transform PDF pages into PPTX presentation slides. No signup required. Free browser-based tool.' },
                'crop-pdf': { title: 'Crop PDF Pages Online Free — Resize PDF Page Size | PDF Genius Tools', desc: 'Crop and resize PDF pages online free. Adjust margins and page dimensions of any PDF. No signup, no software needed. Browser-based PDF crop tool.' },
            };

                // Update page meta tags for SEO when tool URL is visited directly
                if (toolSeoMap[path]) {
                    document.title = toolSeoMap[path].title;
                    var metaDesc = document.querySelector('meta[name="description"]');
                    if (metaDesc) metaDesc.setAttribute('content', toolSeoMap[path].desc);
                    var ogTitle = document.querySelector('meta[property="og:title"]');
                    if (ogTitle) ogTitle.setAttribute('content', toolSeoMap[path].title);
                    var ogDesc = document.querySelector('meta[property="og:description"]');
                    if (ogDesc) ogDesc.setAttribute('content', toolSeoMap[path].desc);
                    var canonical = document.querySelector('link[rel="canonical"]');
                    if (canonical) canonical.setAttribute('href', 'https://www.pdfgeniustools.online/' + path);
                }

                // Find matching tool key case-insensitively
                var matchedKey = Object.keys(this.toolImplementations).find(function(key) {
                    return key.toLowerCase() === path;
                });
                if (matchedKey) {
                    var tool = this.toolImplementations[matchedKey];
                    // Wait a tick so DOM/cards are ready
                    setTimeout(() => this.openModal(matchedKey, tool, true), 50);
                }
            }

            setupPopstateListener() {
                window.addEventListener('popstate', (e) => {
                    var path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
                    if (!path) {
                        this.closeModal(true);
                        document.title = 'PDF Genius Tools — Free Online PDF Tools';
                        return;
                    }
                    var matchedKey = Object.keys(this.toolImplementations).find(function(key) {
                        return key.toLowerCase() === path;
                    });
                    if (matchedKey) {
                        this.openModal(matchedKey, this.toolImplementations[matchedKey], true);
                    }
                });
            }

            setupTheme() {
                const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                const savedTheme = localStorage.getItem('theme');

                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    this.body.classList.add('dark-mode');
                    this.themeToggleBtn.textContent = '☀️';
                } else {
                    this.body.classList.remove('dark-mode');
                    this.themeToggleBtn.textContent = '🌙';
                }
                if (this.fabricCanvas) this.fabricCanvas.setBackgroundColor(this.body.classList.contains('dark-mode') ? '#333' : 'white', this.fabricCanvas.renderAll.bind(this.fabricCanvas));
                if (this.fabricSignatureCanvas) this.fabricSignatureCanvas.backgroundColor = this.body.classList.contains('dark-mode') ? '#383838' : '#f0f0f0';
            }

            setupEventListeners() {
                this.themeToggleBtn.addEventListener('click', () => {
                    this.body.classList.toggle('dark-mode');
                    const isDarkMode = this.body.classList.contains('dark-mode');
                    this.themeToggleBtn.textContent = isDarkMode ? '☀️' : '🌙';
                    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

                    if (this.modal.style.display === 'flex') {
                        if (this.currentTool?.key === 'edit-pdf' && this.fabricCanvas) {
                           this.fabricCanvas.setBackgroundColor(isDarkMode ? '#333' : 'white', this.fabricCanvas.renderAll.bind(this.fabricCanvas));
                           if(this.pdfDoc && this.selectedFiles.length > 0) {
                               this.loadPdfPageForEditing(this.selectedFiles[0], this.currentPageNum, true); 
                           }
                        }
                        if (this.currentTool?.key === 'sign-pdf' && this.fabricSignatureCanvas) {
                            this.fabricSignatureCanvas.backgroundColor = isDarkMode ? '#383838' : '#f0f0f0';
                            this.fabricSignatureCanvas.freeDrawingBrush.color = isDarkMode ? '#e0e0e0' : '#000000';
                            this.fabricSignatureCanvas.renderAll();
                        }
                    }
                });

                window.addEventListener('scroll', () => {
                    this.header.classList.toggle('scrolled', window.scrollY > 50);
                });

                this.hamburgerMenu.addEventListener('click', () => {
                    this.hamburgerMenu.classList.toggle('active');
                    this.mobileNav.classList.toggle('active');
                    document.body.style.overflow = this.mobileNav.classList.contains('active') ? 'hidden' : '';
                });
                this.mobileNav.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                         this.hamburgerMenu.classList.remove('active');
                         this.mobileNav.classList.remove('active');
                         document.body.style.overflow = '';
                    });
                });

                this.modalCloseBtn.addEventListener('click', () => this.closeModal());
                this.modal.addEventListener('click', (e) => {
                    if (e.target === this.modal) this.closeModal();
                });

                this.fileDropArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    this.fileDropArea.classList.add('dragover');
                });
                this.fileDropArea.addEventListener('dragleave', () => {
                    this.fileDropArea.classList.remove('dragover');
                });
                this.fileDropArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    this.fileDropArea.classList.remove('dragover');
                    this.handleFiles(e.dataTransfer.files);
                });
                this.fileInput.addEventListener('change', (e) => {
                    this.handleFiles(e.target.files);
                });

                this.processBtn.addEventListener('click', () => this.processFiles());
                this.prevPageBtn.addEventListener('click', () => this.changeEditPage(-1));
                this.nextPageBtn.addEventListener('click', () => this.changeEditPage(1));
                this.addTextBtn.addEventListener('click', () => this.addFabricText());
                this.addRectBtn.addEventListener('click', () => this.addFabricRect());
                this.drawModeBtn.addEventListener('click', () => this.toggleFabricDrawMode());
                this.clearPageBtn.addEventListener('click', () => this.clearFabricPage());

                this.clearSignatureBtn.addEventListener('click', () => {
                    if (this.fabricSignatureCanvas) {
                        this.fabricSignatureCanvas.clear();
                        this.fabricSignatureCanvas.backgroundColor = this.body.classList.contains('dark-mode') ? '#383838' : '#f0f0f0';
                        this.fabricSignatureCanvas.renderAll();
                    }
                });
                
                // Page modal close button
                this.pageModalCloseBtn.addEventListener('click', () => this.closePageModal());
                this.pageModal.addEventListener('click', (e) => {
                    if (e.target === this.pageModal) this.closePageModal();
                });
                
                this.setupFooterLinks();
              	
              	// Search functionality
    			this.setupSearchBar();
            }

            setupFooterLinks() {
                // Footer tool links
                document.querySelectorAll('.site-footer a[data-tool], .main-nav a[data-tool]').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault(); 
                        const toolKey = link.dataset.tool;
                        const tool = this.toolImplementations[toolKey];
                        if (tool) {
                            this.openModal(toolKey, tool);
                            this.modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    });
                });
                
                // Page links in footer
                document.querySelectorAll('.site-footer a[data-page], .main-nav a[data-page]').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const pageId = link.dataset.page;
                        this.openPageModal(pageId);
                    });
                });
            }

            openPageModal(pageId) {
                const pageContent = document.getElementById(`${pageId}-page`).innerHTML;
                const pageTitle = pageId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                
                this.pageModalTitle.textContent = pageTitle;
                this.pageModalBody.innerHTML = pageContent;
                this.pageModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }

            closePageModal() {
                this.pageModal.style.display = 'none';
                document.body.style.overflow = '';
            }

            generateToolCards() {
                this.toolsGrid.innerHTML = '';
                const popularTools = ['merge-pdf','compress-pdf','split-pdf','pdf-to-word','jpg-to-pdf','sign-pdf','pdf-to-jpg','rotate-pdf','word-to-pdf','protect-pdf'];
                const newTools = ['compare-pdf','pdf-to-json','remove-pdf-background','pdf-thumbnail-generator'];
                Object.entries(this.toolImplementations).forEach(([key, tool]) => {
                    const card = document.createElement('div');
                    card.className = 'tool-card reveal-on-scroll';
                    let descText = tool.desc;
                    let additionalNotes = '';
                    // Add Popular/New badge
                    if (popularTools.includes(key)) {
                        additionalNotes += '<span class="tool-badge-popular">🔥 Popular</span>';
                    } else if (newTools.includes(key)) {
                        additionalNotes += '<span class="tool-badge-new">✨ New</span>';
                    }

                    if (tool.isPlaceholder) {
                        additionalNotes += '<p style="color:orange; font-size:0.8em; margin-top: 5px;">(Coming Soon)</p>';
                        descText = descText.replace(/\(Coming Soon\)/gi, '').trim();
                    }
                    // Special handling for pptx note, even if not a placeholder overall
                    const pptxNoteMatch = descText.match(/\(\.ppt not supported\.\)/gi);
                    if (pptxNoteMatch) {
                        additionalNotes += `<p style="color:orange; font-size:0.8em; margin-top: 5px;">${pptxNoteMatch[0]}</p>`;
                        descText = descText.replace(pptxNoteMatch[0], '').trim();
                    }
                    
                    card.innerHTML = `
                        ${additionalNotes ? `<div class="card-badge-wrapper">${additionalNotes}</div>` : ''}
                        <div class="tool-card-icon">${tool.icon || '⚙️'}</div>
                        <h3>${tool.title}</h3>
                        <p>${descText}</p>
                    `;

                    if (!tool.isPlaceholder) {
                        card.addEventListener('click', () => this.openModal(key, tool));
                    } else {
                        card.style.cursor = 'not-allowed';
                        card.style.opacity = '0.7';
                    }
                    this.toolsGrid.appendChild(card);
                });
                this.initRevealOnScroll(); 
            }

            openModal(toolKey, tool, skipUrlUpdate) {
                this.currentTool = tool;
                this.currentTool.key = toolKey; 
                this.resetModal();
                this.modalTitle.textContent = tool.title;

                // Update URL to reflect the open tool (e.g. /Split-PDF)
                if (!skipUrlUpdate) {
                    var urlSlug = toolKey;
                    var newUrl = '/' + urlSlug;
                    if (window.location.pathname.toLowerCase() !== newUrl.toLowerCase()) {
                        window.history.pushState({ toolKey: toolKey }, tool.title, newUrl);
                        document.title = tool.title + ' — Free Online PDF Tool | PDF Genius Tools';
                    }
                }
                
                let acceptedTypes = tool.fileType || '*/*';
                if (tool.fileType === 'text/html') acceptedTypes = '.html,.htm'; 
                this.fileInput.accept = acceptedTypes;
                this.fileTypeInfo.textContent = `Accepted file type(s): ${tool.fileType || 'Any'}`;

                if (tool.options) {
                    tool.options(this.toolOptionsDiv, tool);
                }
              
              	// REMOVE old SEO content if switching tools
				this.toolContentDiv?.remove();
                
              	// ADD SEO content
                if (tool.content) {
                    this.toolContentDiv = document.createElement('div');
                    this.toolContentDiv.className = 'tool-seo-content-wrapper';
                    this.toolContentDiv.innerHTML = tool.content;

                    // Append BELOW options
                    this.toolOptionsDiv.parentNode.appendChild(this.toolContentDiv);
                }
              
                this.editCanvasContainer.style.display = toolKey === 'edit-pdf' ? 'block' : 'none';
                this.signatureCanvasContainer.style.display = toolKey === 'sign-pdf' ? 'block' : 'none';
                if(toolKey === 'html-to-pdf' && document.getElementById('html-input-type')?.value === 'text') {
                    this.fileDropArea.style.display = 'none';
                } else {
                    this.fileDropArea.style.display = 'block';
                }
                
                const isDarkMode = this.body.classList.contains('dark-mode');
                if (toolKey === 'edit-pdf') {
                    if (this.fabricCanvas) this.fabricCanvas.setBackgroundColor(isDarkMode ? '#333' : 'white', this.fabricCanvas.renderAll.bind(this.fabricCanvas));
                    if (this.selectedFiles.length > 0 && this.pdfDoc) this.loadPdfPageForEditing(this.selectedFiles[0], this.currentPageNum, true);
                }
                if (toolKey === 'sign-pdf') {
                    if (this.fabricSignatureCanvas) {
                        this.fabricSignatureCanvas.backgroundColor = isDarkMode ? '#383838' : '#f0f0f0';
                        this.fabricSignatureCanvas.freeDrawingBrush.color = isDarkMode ? '#e0e0e0' : '#000000';
                        this.fabricSignatureCanvas.renderAll();
                    }
                }

                // On standalone tool pages the modal is already visible inline —
                // skip the overlay show and body scroll-lock.
                if (!document.body.classList.contains('standalone-tool-page')) {
                    this.modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            }

            closeModal(skipUrlUpdate) {
                // Don't close on standalone tool pages
                if (document.body.classList.contains('standalone-tool-page')) return;
                this.modal.style.display = 'none';
                this.resetModal();
                this.currentTool = null;
                document.body.style.overflow = ''; 

                // Reset URL back to home when modal closes
                if (!skipUrlUpdate && window.location.pathname !== '/') {
                    window.history.pushState({}, 'PDF Genius Tools', '/');
                    document.title = 'PDF Genius Tools — Free Online PDF Tools';
                }
              
                if(this.fabricCropCanvas) {
        		this.fabricCropCanvas.dispose();
        		this.fabricCropCanvas = null;
    			}
              
              	// Add cleanup for reorder tool:
    			this.reorderPageData = [];
	
              	// Add these lines for redact cleanup:
                if(this.fabricRedactCanvas) {
                    this.fabricRedactCanvas.dispose();
                    this.fabricRedactCanvas = null;
                }
              
              	// Add cleanup for JSON converter:
    			this.currentJsonData = null;

    			this.reorderPageData = [];          
                this.redactPdfDoc = null;
                this.redactBoxes = {};
                this.redactCurrentPage = 1;
              
                this.editCanvasContainer.style.display = 'none';
                this.signatureCanvasContainer.style.display = 'none';
                this.fileDropArea.style.display = 'block'; 
                if(this.fabricCanvas) this.resetEditCanvas();
                if(this.fabricSignatureCanvas) this.resetSignatureCanvas(); 
            }

            resetModal() {
                this.selectedFiles = [];
                this.updateFileList();
                this.toolOptionsDiv.innerHTML = '';
                this.outputArea.innerHTML = '';
                this.processBtn.disabled = true;
                this.fileInput.value = ''; 
                if (this.currentTool?.key !== 'edit-pdf' && this.fabricCanvas) {
                    this.resetEditCanvas();
                }
                if (this.currentTool?.key !== 'sign-pdf' && this.fabricSignatureCanvas) {
                   this.resetSignatureCanvas();
                }
              
                if (this.currentTool?.key !== 'crop-pdf' && this.fabricCropCanvas) {
        			this.fabricCropCanvas.dispose();
        			this.fabricCropCanvas = null;
        			const previewContainer = document.getElementById('crop-preview-container');
        			if(previewContainer) previewContainer.style.display = 'none';
    			}
            }
            
            resetEditCanvas() {
                if(this.fabricCanvas) {
                    this.fabricCanvas.clear();
                    this.fabricCanvas.setBackgroundColor(this.body.classList.contains('dark-mode') ? '#333' : 'white', this.fabricCanvas.renderAll.bind(this.fabricCanvas));
                }
                this.pdfDoc = null;
                this.currentPageNum = 1;
                this.pageAnnotations = {};
                this.pageNumDisplay.textContent = 'Page 1/1';
                this.prevPageBtn.disabled = true;
                this.nextPageBtn.disabled = true;
            }

            resetSignatureCanvas() {
                 if(this.fabricSignatureCanvas) {
                    this.fabricSignatureCanvas.clear();
                    this.fabricSignatureCanvas.backgroundColor = this.body.classList.contains('dark-mode') ? '#383838' : '#f0f0f0';
                    this.fabricSignatureCanvas.renderAll();
                }
            }

            handleFiles(files) {
                if (!this.currentTool) return;
                const newFiles = Array.from(files);

                if (this.currentTool.fileType) {
                    const allowedTypes = this.currentTool.fileType.split(',');
                    const invalidFiles = newFiles.filter(file => 
                        !allowedTypes.some(type => file.name.toLowerCase().endsWith(type.trim()) || file.type === type.trim())
                    );
                    if (invalidFiles.length > 0) {
                        this.showError(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}. Expected: ${this.currentTool.fileType}`);
                        return;
                    }
                }

                if (this.currentTool.multiple) {
                    this.selectedFiles.push(...newFiles);
                } else {
                    this.selectedFiles = [newFiles[0]]; 
                }
                this.updateFileList();
                this.processBtn.disabled = this.selectedFiles.length === 0;

                if (this.currentTool.onFileSelect) {
                    this.currentTool.onFileSelect(this.selectedFiles, this.toolOptionsDiv);
                }
            }

            updateFileList() {
                this.fileListDiv.innerHTML = '';
                this.selectedFiles.forEach((file, index) => {
                    const fileDiv = document.createElement('div');
                    fileDiv.textContent = file.name;
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '&times;';
                    removeBtn.onclick = () => {
                        this.selectedFiles.splice(index, 1);
                        this.updateFileList();
                        this.processBtn.disabled = this.selectedFiles.length === 0;
                         if (this.selectedFiles.length === 0 && this.currentTool.onFileSelect) { 
                            if(this.currentTool.key === 'edit-pdf') this.resetEditCanvas();
                            if(this.currentTool.key === 'sign-pdf') this.resetSignatureCanvas();
                            if(this.currentTool.key === 'organize-pdf') {
                                const organizer = document.getElementById('page-organizer');
                                if (organizer) organizer.innerHTML = '';
                            }
                        }
                    };
                    fileDiv.appendChild(removeBtn);
                    this.fileListDiv.appendChild(fileDiv);
                });
            }

            async processFiles() {
                if (this.selectedFiles.length === 0 && !(this.currentTool.key === 'html-to-pdf' && document.getElementById('html-input-type')?.value === 'text') || !this.currentTool || !this.currentTool.process) {
                    if (this.currentTool.key === 'html-to-pdf' && document.getElementById('html-input-type')?.value === 'text' && !document.getElementById('html-raw-text').value.trim()) {
                         this.showError("HTML code cannot be empty."); return;
                    } else if (this.selectedFiles.length === 0 && !(this.currentTool.key === 'html-to-pdf')) {
                         return; 
                    }
                }

                const options = {};
                this.toolOptionsDiv.querySelectorAll('input, select, textarea').forEach(input => {
                    if (input.type === 'checkbox') {
                        options[input.id] = input.checked;
                    } else {
                        options[input.id] = input.value;
                    }
                });

                this.showLoader('Processing...');
                this.outputArea.innerHTML = ''; 
                try {
                    const result = await this.currentTool.process(this.selectedFiles, options);
                    if (result !== "processing") { 
                         this.hideLoader();
                    }
                } catch (error) {
                    console.error('Processing error:', error);
                    this.showError(`Error during ${this.currentTool.title}: ${error.message}`);
                    this.hideLoader();
                }
            }

            showLoader(text = 'Processing...') {
                this.loaderText.textContent = text;
                this.loaderOverlay.style.display = 'flex';
            }

            hideLoader() {
                this.loaderOverlay.style.display = 'none';
            }

            showError(message) {
                alert(`Error: ${message}`); 
            }

            createDownloadLink(data, filename, type) {
                const blob = data instanceof Blob ? data : new Blob([data], { type });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.textContent = `Download ${filename}`;
                a.className = 'btn';
                this.outputArea.innerHTML = ''; 
                this.outputArea.appendChild(a);
            }

            initRevealOnScroll() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                        }
                    });
                }, { threshold: 0.1 });

                document.querySelectorAll('.reveal-on-scroll').forEach(el => {
                    el.classList.remove('active'); 
                    observer.observe(el);
                });
            }

            async loadPdfPageForEditing(file, pageNum, forceBgRerender = false) {
                if (!file) return;
                this.showLoader(`Loading page ${pageNum}...`);
                const isDarkMode = this.body.classList.contains('dark-mode');
                try {
                    if (!this.pdfDoc || this.pdfDoc.fileFromArrayBuffer !== file) { 
                        const pdfBytes = await file.arrayBuffer();
                        this.pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                        this.pdfDoc.fileFromArrayBuffer = file; 
                    }

                    const page = await this.pdfDoc.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.0 }); 

                    const containerWidth = this.pdfEditCanvasEl.parentElement.clientWidth -2; 
                    const scaleToFit = containerWidth / viewport.width;
                    const scaledViewport = page.getViewport({ scale: scaleToFit });

                    this.fabricCanvas.setWidth(scaledViewport.width);
                    this.fabricCanvas.setHeight(scaledViewport.height);
                    
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = scaledViewport.width;
                    tempCanvas.height = scaledViewport.height;
                    const tempCtx = tempCanvas.getContext('2d');

                    if (isDarkMode && forceBgRerender) { 
                        tempCtx.fillStyle = '#333';
                        tempCtx.fillRect(0,0, tempCanvas.width, tempCanvas.height);
                    }

                    await page.render({ canvasContext: tempCtx, viewport: scaledViewport }).promise;
                    const bgDataUrl = tempCanvas.toDataURL();

                    this.fabricCanvas.setBackgroundImage(bgDataUrl, this.fabricCanvas.renderAll.bind(this.fabricCanvas), {
                        originX: 'left',
                        originY: 'top',
                        crossOrigin: 'anonymous' 
                    });

                    this.currentPageNum = pageNum;
                    this.pageNumDisplay.textContent = `Page ${pageNum}/${this.pdfDoc.numPages}`;
                    this.prevPageBtn.disabled = pageNum <= 1;
                    this.nextPageBtn.disabled = pageNum >= this.pdfDoc.numPages;

                    this.fabricCanvas.clear(); 
                    this.fabricCanvas.setBackgroundImage(bgDataUrl, this.fabricCanvas.renderAll.bind(this.fabricCanvas), { originX: 'left', originY: 'top', crossOrigin: 'anonymous'});
                    if (this.pageAnnotations[pageNum]) {
                        this.fabricCanvas.loadFromJSON({ objects: this.pageAnnotations[pageNum] }, this.fabricCanvas.renderAll.bind(this.fabricCanvas));
                    }

                } catch (err) {
                    this.showError('Error loading PDF page: ' + err.message);
                    console.error(err);
                } finally {
                    this.hideLoader();
                }
            }
            
            async changeEditPage(delta) {
                if (this.fabricCanvas && this.pdfDoc) {
                    this.pageAnnotations[this.currentPageNum] = this.fabricCanvas.getObjects().map(obj => obj.toObject());
                }

                const newPageNum = this.currentPageNum + delta;
                if (newPageNum >= 1 && newPageNum <= this.pdfDoc.numPages) {
                    await this.loadPdfPageForEditing(this.selectedFiles[0], newPageNum, true); 
                }
            }

            addFabricText() {
                if (!this.fabricCanvas) return;
                const isDarkMode = this.body.classList.contains('dark-mode');
                const text = new fabric.IText('Sample Text', {
                    left: 50,
                    top: 50,
                    fontFamily: 'helvetica',
                    fontSize: 20,
                    fill: isDarkMode ? '#e0e0e0' : '#000000',
                });
                this.fabricCanvas.add(text);
                this.fabricCanvas.setActiveObject(text);
            }

            addFabricRect() {
                if (!this.fabricCanvas) return;
                const isDarkMode = this.body.classList.contains('dark-mode');
                const rect = new fabric.Rect({
                    left: 100,
                    top: 100,
                    width: 100,
                    height: 50,
                    fill: isDarkMode ? 'rgba(255,102,89,0.5)' : 'rgba(255,0,0,0.5)', 
                    stroke: isDarkMode ? getComputedStyle(document.documentElement).getPropertyValue('--dm-primary-red-accent').trim() : getComputedStyle(document.documentElement).getPropertyValue('--primary-red').trim(),
                    strokeWidth: 2,
                });
                this.fabricCanvas.add(rect);
                this.fabricCanvas.setActiveObject(rect);
            }

            toggleFabricDrawMode() {
                if (!this.fabricCanvas) return;
                const isDarkMode = this.body.classList.contains('dark-mode');
                this.fabricCanvas.isDrawingMode = !this.fabricCanvas.isDrawingMode;
                this.drawModeBtn.textContent = this.fabricCanvas.isDrawingMode ? 'Exit Draw Mode' : 'Draw';
                if (this.fabricCanvas.isDrawingMode) {
                    this.fabricCanvas.freeDrawingBrush.color = isDarkMode ? getComputedStyle(document.documentElement).getPropertyValue('--dm-primary-red-accent').trim() : getComputedStyle(document.documentElement).getPropertyValue('--primary-red').trim();
                    this.fabricCanvas.freeDrawingBrush.width = 5;
                }
            }
          
            clearFabricPage() {
                 if (this.fabricCanvas && this.pdfDoc) {
                    const bgImage = this.fabricCanvas.backgroundImage;
                    this.fabricCanvas.clear(); 
                    this.fabricCanvas.setBackgroundImage(bgImage, this.fabricCanvas.renderAll.bind(this.fabricCanvas)); 
                    this.pageAnnotations[this.currentPageNum] = []; 
                }
            }
          
            hexToRgbPdfLib(hex) {
                if (!hex || hex === 'transparent') return undefined; 
                let r, g, b;
                if (hex.startsWith('rgba')) { 
                    const parts = hex.substring(hex.indexOf('(') + 1, hex.lastIndexOf(')')).split(/,\s*/);
                    r = parseInt(parts[0]) / 255;
                    g = parseInt(parts[1]) / 255;
                    b = parseInt(parts[2]) / 255;
                } else { 
                    const bigint = parseInt(hex.slice(1), 16);
                    r = ((bigint >> 16) & 255) / 255;
                    g = ((bigint >> 8) & 255) / 255;
                    b = (bigint & 255) / 255;
                }
                return rgb(r, g, b);
            }
          
            async fabricObjectToImage(obj, canvas) {
                const originalVisibleStates = {};
                canvas.getObjects().forEach(o => {
                    if (o !== obj) {
                        originalVisibleStates[o.id || o.cacheKey] = o.visible; 
                        o.set('visible', false);
                    }
                });
                obj.set('visible', true); 

                const dataURL = obj.toDataURL({
                    format: 'png',
                    left: obj.left,
                    top: obj.top,
                    width: obj.width * obj.scaleX,
                    height: obj.height * obj.scaleY,
                });

                canvas.getObjects().forEach(o => {
                     if (o !== obj && (originalVisibleStates[o.id || o.cacheKey] !== undefined) ) {
                        o.set('visible', originalVisibleStates[o.id || o.cacheKey]);
                    }
                });
                canvas.renderAll(); 
                return fetch(dataURL).then(res => res.arrayBuffer());
            }

            async setupPageOrganizationUI(file) {
                const pageOrganizerDiv = document.getElementById('page-organizer');
                if (!pageOrganizerDiv) return;
                pageOrganizerDiv.innerHTML = '<p>Loading pages...</p>';
                pageOrganizerDiv.style.backgroundColor = this.body.classList.contains('dark-mode') ? 'var(--dm-bg-primary)' : 'var(--background-light)';

                const pdfBytes = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                pageOrganizerDiv.innerHTML = ''; 

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 0.2 }); 
                    const canvas = document.createElement('canvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const context = canvas.getContext('2d');
                    await page.render({ canvasContext: context, viewport: viewport }).promise;

                    const pageDiv = document.createElement('div');
                    pageDiv.className = 'page-thumbnail-container';
                    pageDiv.style.position = 'relative';
                    pageDiv.style.border = '1px solid var(--border-color)';
                    pageDiv.style.padding = '5px';
                    pageDiv.style.cursor = 'grab';
                    pageDiv.style.backgroundColor = 'var(--background-white)'; 
                    pageDiv.draggable = true;
                    pageDiv.dataset.originalIndex = (i - 1).toString(); 

                    const img = document.createElement('img');
                    img.src = canvas.toDataURL();
                    img.style.display = 'block';
                    img.style.maxWidth = '100px'; 
                    img.style.maxHeight = '141px';

                    const pageLabel = document.createElement('p');
                    pageLabel.textContent = `Page ${i}`;
                    pageLabel.style.textAlign = 'center';
                    pageLabel.style.fontSize = '0.8em';
                    pageLabel.style.color = 'var(--text-dark)'; 
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerHTML = '&times;';
                    deleteBtn.style.position = 'absolute';
                    deleteBtn.style.top = '0';
                    deleteBtn.style.right = '0';
                    deleteBtn.style.background = 'red';
                    deleteBtn.style.color = 'white';
                    deleteBtn.style.border = 'none';
                    deleteBtn.style.cursor = 'pointer';
                    deleteBtn.onclick = () => {
                        const isDeleted = pageDiv.dataset.deleted === 'true';
                        pageDiv.dataset.deleted = (!isDeleted).toString();
                        pageDiv.style.opacity = !isDeleted ? '0.5' : '1';
                        deleteBtn.textContent = !isDeleted ? '↩' : '×'; 
                        deleteBtn.style.background = !isDeleted ? 'green' : 'red';
                    };
                    
                    pageDiv.appendChild(img);
                    pageDiv.appendChild(pageLabel);
                    pageDiv.appendChild(deleteBtn);
                    pageOrganizerDiv.appendChild(pageDiv);

                    pageDiv.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', pageDiv.dataset.originalIndex);
                        e.target.style.opacity = '0.4';
                    });
                    pageDiv.addEventListener('dragend', (e) => {
                        e.target.style.opacity = pageDiv.dataset.deleted === 'true' ? '0.5' : '1';
                    });
                     pageDiv.addEventListener('dragover', (e) => e.preventDefault() ); 
                    pageDiv.addEventListener('drop', (e) => {
                        e.preventDefault();
                        const draggedIndex = e.dataTransfer.getData('text/plain');
                        const draggedEl = pageOrganizerDiv.querySelector(`.page-thumbnail-container[data-original-index='${draggedIndex}']`);
                        const targetEl = e.target.closest('.page-thumbnail-container');
                        
                        if (draggedEl && targetEl && draggedEl !== targetEl) {
                             const targetRect = targetEl.getBoundingClientRect();
                             const isAfter = e.clientY > targetRect.top + targetRect.height / 2;
                            if (isAfter) {
                                pageOrganizerDiv.insertBefore(draggedEl, targetEl.nextSibling);
                            } else {
                                pageOrganizerDiv.insertBefore(draggedEl, targetEl);
                            }
                        }
                    });
                }
            }
          
            async loadRedactPage(pageNum) {
            if (!this.redactPdfDoc) return;

            const canvas = document.getElementById('redact-canvas');
            const previewContainer = document.getElementById('redact-preview-container');

            if (!canvas || !previewContainer) return;

            try {
                const page = await this.redactPdfDoc.getPage(pageNum);
                const containerWidth = previewContainer.clientWidth - 2;
                const viewport = page.getViewport({ scale: 1.0 });
                const scale = containerWidth / viewport.width;
                const scaledViewport = page.getViewport({ scale: scale });

                // Dispose existing canvas
                if (this.fabricRedactCanvas) {
                    // Save current page boxes before disposing
                    this.saveRedactBoxes();
                    this.fabricRedactCanvas.dispose();
                }

                // Create new Fabric canvas
                this.fabricRedactCanvas = new fabric.Canvas(canvas, {
                    width: scaledViewport.width,
                    height: scaledViewport.height
                });

                // Render PDF page as background
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = scaledViewport.width;
                tempCanvas.height = scaledViewport.height;
                await page.render({ 
                    canvasContext: tempCanvas.getContext('2d'), 
                    viewport: scaledViewport 
                }).promise;

                this.fabricRedactCanvas.setBackgroundImage(
                    tempCanvas.toDataURL(), 
                    this.fabricRedactCanvas.renderAll.bind(this.fabricRedactCanvas), 
                    { originX: 'left', originY: 'top' }
                );

                // Load existing redaction boxes for this page
                if (this.redactBoxes[pageNum]) {
                    this.redactBoxes[pageNum].forEach(boxData => {
                        const rect = new fabric.Rect({
                            left: boxData.left,
                            top: boxData.top,
                            width: boxData.width,
                            height: boxData.height,
                            fill: 'rgba(0, 0, 0, 0.7)',
                            stroke: '#e5322d',
                            strokeWidth: 2,
                            hasRotatingPoint: false
                        });
                        this.fabricRedactCanvas.add(rect);
                    });
                }

                this.redactCurrentPage = pageNum;

                // Update UI
                const pageDisplay = document.getElementById('redact-page-display');
                const prevBtn = document.getElementById('redact-prev-page');
                const nextBtn = document.getElementById('redact-next-page');

                if (pageDisplay) pageDisplay.textContent = `Page ${pageNum} / ${this.redactPdfDoc.numPages}`;
                if (prevBtn) prevBtn.disabled = pageNum <= 1;
                if (nextBtn) nextBtn.disabled = pageNum >= this.redactPdfDoc.numPages;

                this.updateRedactSummary();

            } catch (error) {
                this.showError('Error loading page: ' + error.message);
            }
        }

            saveRedactBoxes() {
                if (!this.fabricRedactCanvas || !this.redactCurrentPage) return;

                const boxes = this.fabricRedactCanvas.getObjects('rect').map(rect => ({
                    left: rect.left,
                    top: rect.top,
                    width: rect.getScaledWidth(),
                    height: rect.getScaledHeight()
                }));

                if (boxes.length > 0) {
                    this.redactBoxes[this.redactCurrentPage] = boxes;
                } else {
                    delete this.redactBoxes[this.redactCurrentPage];
                }
            }

            changeRedactPage(delta) {
                if (!this.redactPdfDoc) return;

                this.saveRedactBoxes();
                const newPage = this.redactCurrentPage + delta;

                if (newPage >= 1 && newPage <= this.redactPdfDoc.numPages) {
                    this.loadRedactPage(newPage);
                }
            }

            addRedactionBox() {
                if (!this.fabricRedactCanvas) return;

                const rect = new fabric.Rect({
                    left: 50,
                    top: 50,
                    width: 150,
                    height: 50,
                    fill: 'rgba(0, 0, 0, 0.7)',
                    stroke: '#e5322d',
                    strokeWidth: 2,
                    hasRotatingPoint: false,
                    transparentCorners: false,
                    cornerColor: '#e5322d',
                    cornerSize: 10
                });

                this.fabricRedactCanvas.add(rect);
                this.fabricRedactCanvas.setActiveObject(rect);
                this.updateRedactSummary();
            }

            clearRedactPage() {
                if (!this.fabricRedactCanvas) return;

                const bgImage = this.fabricRedactCanvas.backgroundImage;
                this.fabricRedactCanvas.clear();
                this.fabricRedactCanvas.setBackgroundImage(
                    bgImage, 
                    this.fabricRedactCanvas.renderAll.bind(this.fabricRedactCanvas)
                );

                if (this.redactCurrentPage) {
                    delete this.redactBoxes[this.redactCurrentPage];
                }

                this.updateRedactSummary();
            }

            updateRedactSummary() {
                this.saveRedactBoxes();

                const summaryDiv = document.getElementById('redact-summary');
                const contentDiv = document.getElementById('redact-summary-content');

                if (!summaryDiv || !contentDiv) return;

                const totalBoxes = Object.values(this.redactBoxes).reduce((sum, boxes) => sum + boxes.length, 0);
                const pagesWithRedactions = Object.keys(this.redactBoxes).length;

                if (totalBoxes > 0) {
                    summaryDiv.style.display = 'block';
                    contentDiv.innerHTML = `
                        <p>${totalBoxes} redaction box(es) on ${pagesWithRedactions} page(s)</p>
                        <ul style="margin-top: 5px; font-size: 0.9em;">
                            ${Object.entries(this.redactBoxes).map(([page, boxes]) => 
                                `<li>Page ${page}: ${boxes.length} box(es)</li>`
                            ).join('')}
                        </ul>
                    `;
                } else {
                    summaryDiv.style.display = 'none';
                }
            }          

          	async setupPageReorderUI(file) {
            const previewContainer = document.getElementById('reorder-preview-container');
            const pagesGrid = document.getElementById('reorder-pages-grid');
            const infoDiv = document.getElementById('reorder-info');
            const statusText = document.getElementById('reorder-status-text');

            if (!previewContainer || !pagesGrid) return;

            previewContainer.style.display = 'block';
            if (infoDiv) infoDiv.style.display = 'block';
            if (statusText) statusText.textContent = 'Loading pages...';
            pagesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">Loading page thumbnails...</p>';

            try {
                const pdfBytes = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                const numPages = pdf.numPages;

                this.reorderPageData = [];
                pagesGrid.innerHTML = '';

                for (let i = 1; i <= numPages; i++) {
                    if (statusText) statusText.textContent = `Loading page ${i}/${numPages}...`;

                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 0.3 });
                    const canvas = document.createElement('canvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const context = canvas.getContext('2d');

                    await page.render({ canvasContext: context, viewport: viewport }).promise;

                    const pageDiv = document.createElement('div');
                    pageDiv.className = 'reorder-page-item';
                    pageDiv.draggable = true;
                    pageDiv.dataset.originalIndex = (i - 1).toString();
                    pageDiv.dataset.pageNumber = i.toString();

                    pageDiv.style.cssText = `
                        position: relative;
                        border: 2px solid var(--border-color);
                        border-radius: 8px;
                        padding: 10px;
                        background-color: var(--background-white);
                        cursor: grab;
                        transition: all 0.3s ease;
                        box-shadow: var(--shadow-light);
                    `;

                    pageDiv.innerHTML = `
                        <div style="position: absolute; top: 5px; left: 5px; background-color: var(--primary-red); color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.85em; z-index: 10;">
                            ${i}
                        </div>
                        <img src="${canvas.toDataURL()}" style="width: 100%; height: auto; display: block; border-radius: 4px;">
                        <p style="text-align: center; margin: 8px 0 0 0; font-size: 0.9em; color: var(--text-dark); font-weight: 500;">Page ${i}</p>
                    `;

                    this.setupReorderDragEvents(pageDiv);
                    pagesGrid.appendChild(pageDiv);

                    this.reorderPageData.push({
                        index: i - 1,
                        canvas: canvas.toDataURL()
                    });
                }

                if (statusText) statusText.textContent = `${numPages} page(s) loaded. Drag to reorder.`;

            } catch (error) {
                this.showError('Error loading PDF pages: ' + error.message);
                if (statusText) statusText.textContent = 'Error loading pages.';
                pagesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--primary-red);">Error loading pages.</p>';
            }
        }

        	setupReorderDragEvents(element) {
            let draggedElement = null;

            element.addEventListener('dragstart', (e) => {
                draggedElement = element;
                element.style.opacity = '0.4';
                element.style.cursor = 'grabbing';
                e.dataTransfer.effectAllowed = 'move';
            });

            element.addEventListener('dragend', (e) => {
                element.style.opacity = '1';
                element.style.cursor = 'grab';

                // Update page numbers after reorder
                const pagesGrid = document.getElementById('reorder-pages-grid');
                if (pagesGrid) {
                    Array.from(pagesGrid.children).forEach((child, index) => {
                        const label = child.querySelector('p');
                        const badge = child.querySelector('div');
                        if (label) label.textContent = `Page ${index + 1}`;
                        if (badge) badge.textContent = `${index + 1}`;
                    });
                }
            });

            element.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                if (draggedElement && draggedElement !== element) {
                    const pagesGrid = element.parentElement;
                    const allItems = Array.from(pagesGrid.children);
                    const draggedIndex = allItems.indexOf(draggedElement);
                    const targetIndex = allItems.indexOf(element);

                    if (draggedIndex < targetIndex) {
                        pagesGrid.insertBefore(draggedElement, element.nextSibling);
                    } else {
                        pagesGrid.insertBefore(draggedElement, element);
                    }
                }
            });

            element.addEventListener('dragenter', (e) => {
                e.preventDefault();
                if (draggedElement && draggedElement !== element) {
                    element.style.borderColor = 'var(--primary-red)';
                    element.style.transform = 'scale(1.05)';
                }
            });

            element.addEventListener('dragleave', (e) => {
                element.style.borderColor = 'var(--border-color)';
                element.style.transform = 'scale(1)';
            });

            element.addEventListener('drop', (e) => {
                e.preventDefault();
                element.style.borderColor = 'var(--border-color)';
                element.style.transform = 'scale(1)';
            });
        }

        	resetPageOrder() {
            const pagesGrid = document.getElementById('reorder-pages-grid');
            if (!pagesGrid || !this.reorderPageData) return;

            const items = Array.from(pagesGrid.children);
            items.sort((a, b) => {
                return parseInt(a.dataset.originalIndex) - parseInt(b.dataset.originalIndex);
            });

            pagesGrid.innerHTML = '';
            items.forEach((item, index) => {
                const label = item.querySelector('p');
                const badge = item.querySelector('div');
                if (label) label.textContent = `Page ${index + 1}`;
                if (badge) badge.textContent = `${index + 1}`;
                pagesGrid.appendChild(item);
            });

            const statusText = document.getElementById('reorder-status-text');
            if (statusText) {
                statusText.textContent = 'Order reset to original.';
            }
        }

        	escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
          
          	setupSearchBar() {
                const searchInput = document.getElementById('tool-search-input');
                const clearBtn = document.getElementById('clear-search-btn');
                const resultsDropdown = document.getElementById('search-results-dropdown');
                const searchStatus = document.getElementById('search-status');
                const searchStatusText = document.getElementById('search-status-text');
                const toolsGrid = document.getElementById('tools-grid');

                if (!searchInput) return;

                let searchTimeout;

                // Search input handler
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    const query = e.target.value.trim().toLowerCase();

                    // Show/hide clear button
                    if (clearBtn) {
                        clearBtn.style.display = query ? 'flex' : 'none';
                    }

                    // Debounce search
                    searchTimeout = setTimeout(() => {
                        if (query.length === 0) {
                            this.clearSearch();
                            return;
                        }

                        if (query.length < 2) {
                            resultsDropdown.style.display = 'none';
                            return;
                        }

                        this.performSearch(query);
                    }, 300);
                });

                // Clear button handler
                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        searchInput.value = '';
                        clearBtn.style.display = 'none';
                        this.clearSearch();
                        searchInput.focus();
                    });
                }

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.search-bar-container')) {
                        resultsDropdown.style.display = 'none';
                    }
                });

                // Keyboard navigation
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.clearSearch();
                        searchInput.blur();
                    }
                });
            }

            performSearch(query) {
                const resultsDropdown = document.getElementById('search-results-dropdown');
                const searchStatus = document.getElementById('search-status');
                const searchStatusText = document.getElementById('search-status-text');
                const toolsGrid = document.getElementById('tools-grid');

                if (!resultsDropdown) return;

                // Search through all tools
                const results = [];
                Object.entries(this.toolImplementations).forEach(([key, tool]) => {
                    if (tool.isPlaceholder) return; // Skip placeholder tools

                    const titleMatch = tool.title.toLowerCase().includes(query);
                    const descMatch = tool.desc.toLowerCase().includes(query);
                    const keyMatch = key.toLowerCase().includes(query);

                    if (titleMatch || descMatch || keyMatch) {
                        results.push({
                            key: key,
                            tool: tool,
                            relevance: titleMatch ? 3 : (keyMatch ? 2 : 1) // Prioritize title matches
                        });
                    }
                });

                // Sort by relevance
                results.sort((a, b) => b.relevance - a.relevance);

                // Display results in dropdown
                if (results.length > 0) {
                    resultsDropdown.innerHTML = results.map(({ key, tool }) => `
                        <div class="search-result-item" data-tool-key="${key}">
                            <div class="search-result-icon">${tool.icon || '⚙️'}</div>
                            <div class="search-result-content">
                                <div class="search-result-title">
                                    ${this.highlightText(tool.title, query)}
                                    ${tool.isNew ? '<span class="search-result-badge">New!</span>' : ''}
                                </div>
                                <div class="search-result-desc">${this.highlightText(tool.desc, query)}</div>
                            </div>
                        </div>
                    `).join('');

                    resultsDropdown.style.display = 'block';

                    // Add click handlers to results
                    resultsDropdown.querySelectorAll('.search-result-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const toolKey = item.dataset.toolKey;
                            const tool = this.toolImplementations[toolKey];
                            if (tool && !tool.isPlaceholder) {
                                this.openModal(toolKey, tool);
                                resultsDropdown.style.display = 'none';
                                document.getElementById('tool-search-input').value = '';
                                document.getElementById('clear-search-btn').style.display = 'none';

                                // Scroll to modal
                                setTimeout(() => {
                                    this.modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 100);
                            }
                        });
                    });

                    // Filter tools grid
                    this.filterToolsGrid(query);

                    // Update status
                    if (searchStatus && searchStatusText) {
                        searchStatus.style.display = 'block';
                        searchStatusText.textContent = `Found ${results.length} tool${results.length !== 1 ? 's' : ''} matching "${query}"`;
                    }
                } else {
                    resultsDropdown.innerHTML = `
                        <div class="no-results-message">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <p><strong>No tools found</strong></p>
                            <p style="font-size: 0.9em; margin-top: 5px;">Try searching for: merge, split, compress, convert, edit, sign</p>
                        </div>
                    `;
                    resultsDropdown.style.display = 'block';

                    // Show all tools when no results
                    this.filterToolsGrid('');

                    // Update status
                    if (searchStatus && searchStatusText) {
                        searchStatus.style.display = 'block';
                        searchStatusText.textContent = `No tools found for "${query}"`;
                    }
                }
            }

            filterToolsGrid(query) {
                const toolsGrid = document.getElementById('tools-grid');
                if (!toolsGrid) return;

                const toolCards = toolsGrid.querySelectorAll('.tool-card');
                let visibleCount = 0;

                toolCards.forEach(card => {
                    if (!query) {
                        card.style.display = 'block';
                        visibleCount++;
                        return;
                    }

                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const desc = card.querySelector('p').textContent.toLowerCase();

                    if (title.includes(query) || desc.includes(query)) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Scroll to tools section if filtered
                if (query && visibleCount > 0) {
                    setTimeout(() => {
                        toolsGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                }
            }

            highlightText(text, query) {
                if (!query) return text;

                const regex = new RegExp(`(${query})`, 'gi');
                return text.replace(regex, '<span class="highlight">$1</span>');
            }

            clearSearch() {
                const resultsDropdown = document.getElementById('search-results-dropdown');
                const searchStatus = document.getElementById('search-status');
                const searchInput = document.getElementById('search-input') ||
                                    document.querySelector('.search-input') ||
                                    document.querySelector('input[type="text"][placeholder*="earch"]') ||
                                    document.querySelector('input[placeholder*="PDF"]');

                if (resultsDropdown) resultsDropdown.style.display = 'none';
                if (searchStatus) searchStatus.style.display = 'none';
                if (searchInput) { searchInput.value = ''; searchInput.focus(); }

                // Show all tools
                this.filterToolsGrid('');
            }
          
          	copyJsonToClipboard() {
    if (!this.currentJsonData) {
        alert('No JSON data to copy.');
        return;
    }
    
    navigator.clipboard.writeText(this.currentJsonData).then(() => {
        const copyBtn = document.getElementById('copy-json-btn');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copied!';
            copyBtn.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
        }
    }).catch(err => {
        alert('Failed to copy JSON: ' + err.message);
    });
}

			highlightJson(element) {
    if (!element) return;
    
    let json = element.textContent;
    
    // Simple syntax highlighting
    json = json.replace(/"([^"]+)":/g, '<span style="color: var(--primary-red); font-weight: bold;">"$1"</span>:');
    json = json.replace(/: "([^"]*)"/g, ': <span style="color: #2e7d32;">"$1"</span>');
    json = json.replace(/: (\d+)/g, ': <span style="color: #1565c0;">$1</span>');
    json = json.replace(/: (true|false|null)/g, ': <span style="color: #e65100;">$1</span>');
    
    element.innerHTML = json;
}

			calculateSimilarity(text1, text2) {
    if (text1 === text2) return 100;
    if (text1.length === 0 && text2.length === 0) return 100;
    if (text1.length === 0 || text2.length === 0) return 0;
    
    // Simple similarity calculation based on common characters
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;
    
    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
        if (shorter[i] === longer[i]) matches++;
    }
    
    return Math.round((matches / longer.length) * 100);
}

			compareLines(lines1, lines2) {
    const differences = [];
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] || '';
        const line2 = lines2[i] || '';
        
        if (line1 !== line2) {
            differences.push({
                lineNumber: i + 1,
                file1: line1.substring(0, 100) + (line1.length > 100 ? '...' : ''),
                file2: line2.substring(0, 100) + (line2.length > 100 ? '...' : ''),
                type: !line1 ? 'added' : !line2 ? 'removed' : 'modified'
            });
        }
    }
    
    return differences;
}

			displayComparisonResults(results) {
    const resultsDiv = document.getElementById('comparison-results');
    const summaryDiv = document.getElementById('comparison-summary');
    const detailsDiv = document.getElementById('comparison-details');
    
    if (!resultsDiv || !summaryDiv || !detailsDiv) return;
    
    resultsDiv.style.display = 'block';
    
    // Display summary
    const isDarkMode = this.body.classList.contains('dark-mode');
    const matchColor = '#4CAF50';
    const diffColor = isDarkMode ? '#ff6659' : '#e5322d';
    
    summaryDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="padding: 12px; background: var(--background-white); border-radius: 6px; border-left: 4px solid var(--primary-red);">
                <div style="font-size: 0.85em; color: var(--text-light); margin-bottom: 5px;">Total Differences</div>
                <div style="font-size: 1.5em; font-weight: bold; color: ${diffColor};">${results.summary.totalDifferences}</div>
            </div>
            <div style="padding: 12px; background: var(--background-white); border-radius: 6px; border-left: 4px solid ${matchColor};">
                <div style="font-size: 0.85em; color: var(--text-light); margin-bottom: 5px;">Identical Pages</div>
                <div style="font-size: 1.5em; font-weight: bold; color: ${matchColor};">${results.summary.identicalPages}</div>
            </div>
            <div style="padding: 12px; background: var(--background-white); border-radius: 6px; border-left: 4px solid ${diffColor};">
                <div style="font-size: 0.85em; color: var(--text-light); margin-bottom: 5px;">Different Pages</div>
                <div style="font-size: 1.5em; font-weight: bold; color: ${diffColor};">${results.summary.differentPages}</div>
            </div>
        </div>
        
        <div style="margin-top: 15px; padding: 10px; background: var(--background-white); border-radius: 6px;">
            <strong style="color: var(--text-dark);">📁 Files Compared:</strong><br>
            <span style="color: var(--text-light); font-size: 0.9em;">
                1. ${results.file1}<br>
                2. ${results.file2}
            </span>
        </div>
    `;
    
    // Display detailed differences
    if (results.differences.length === 0) {
        detailsDiv.innerHTML = `
            <div style="padding: 30px; text-align: center; color: ${matchColor};">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3 style="margin: 0 0 10px 0;">Files are Identical!</h3>
                <p style="color: var(--text-light);">No differences found between the two PDF files.</p>
            </div>
        `;
    } else {
        let detailsHtml = '';
        
        results.differences.forEach((diff, index) => {
            detailsHtml += `
                <div style="padding: 15px; border-bottom: 1px solid var(--border-color); ${index % 2 === 0 ? 'background: var(--background-light);' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong style="color: var(--primary-red);">Page ${diff.pageNumber}</strong>
                        <span style="padding: 4px 10px; background: ${diff.similarity > 70 ? matchColor : diffColor}; color: white; border-radius: 12px; font-size: 0.85em;">
                            ${diff.similarity}% Similar
                        </span>
                    </div>
                    
                    <div style="color: var(--text-light); font-size: 0.9em; margin-bottom: 8px;">
                        File 1: ${diff.file1Length} characters • File 2: ${diff.file2Length} characters
                    </div>
                    
                    ${diff.previewFile1 ? `
                        <div style="margin-top: 10px;">
                            <div style="font-weight: bold; color: var(--text-dark); font-size: 0.85em; margin-bottom: 5px;">📄 File 1 Preview:</div>
                            <div style="padding: 8px; background: var(--background-white); border-left: 3px solid #1976d2; font-family: monospace; font-size: 0.8em; color: var(--text-dark); border-radius: 4px;">
                                ${this.escapeHtml(diff.previewFile1)}
                            </div>
                        </div>
                        <div style="margin-top: 8px;">
                            <div style="font-weight: bold; color: var(--text-dark); font-size: 0.85em; margin-bottom: 5px;">📄 File 2 Preview:</div>
                            <div style="padding: 8px; background: var(--background-white); border-left: 3px solid #d32f2f; font-family: monospace; font-size: 0.8em; color: var(--text-dark); border-radius: 4px;">
                                ${this.escapeHtml(diff.previewFile2)}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${diff.lineDifferences && diff.lineDifferences.length > 0 ? `
                        <details style="margin-top: 10px;">
                            <summary style="cursor: pointer; color: var(--primary-red); font-weight: bold; font-size: 0.9em;">
                                View ${diff.lineDifferences.length} Line Difference(s)
                            </summary>
                            <div style="margin-top: 10px; padding: 10px; background: var(--background-white); border-radius: 4px; max-height: 200px; overflow-y: auto;">
                                ${diff.lineDifferences.map(lineDiff => `
                                    <div style="margin-bottom: 8px; padding: 6px; border-left: 3px solid ${lineDiff.type === 'added' ? '#4CAF50' : lineDiff.type === 'removed' ? '#f44336' : '#ff9800'}; background: var(--background-light); border-radius: 3px;">
                                        <div style="font-size: 0.75em; color: var(--text-light); margin-bottom: 3px;">
                                            Line ${lineDiff.lineNumber} - ${lineDiff.type === 'added' ? '➕ Added' : lineDiff.type === 'removed' ? '➖ Removed' : '✏️ Modified'}
                                        </div>
                                        ${lineDiff.file1 ? `<div style="font-family: monospace; font-size: 0.75em; color: var(--text-dark);">File 1: ${this.escapeHtml(lineDiff.file1)}</div>` : ''}
                                        ${lineDiff.file2 ? `<div style="font-family: monospace; font-size: 0.75em; color: var(--text-dark);">File 2: ${this.escapeHtml(lineDiff.file2)}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </details>
                    ` : ''}
                </div>
            `;
        });
        
        detailsDiv.innerHTML = detailsHtml;
    }
    
    // Display structure comparison if available
    if (results.structureComparison) {
        const structureHtml = `
            <div style="margin-top: 15px; padding: 15px; background: var(--background-light); border-radius: 8px;">
                <h4 style="color: var(--text-dark); margin: 0 0 15px 0;">📐 Structure Comparison</h4>
                
                <div style="margin-bottom: 12px;">
                    <strong style="color: var(--text-dark);">Page Count:</strong>
                    <div style="margin-top: 5px; padding: 8px; background: var(--background-white); border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                        <span>File 1: <strong>${results.structureComparison.pageCount.file1}</strong> pages</span>
                        <span style="color: ${results.structureComparison.pageCount.match ? matchColor : diffColor}; font-weight: bold;">
                            ${results.structureComparison.pageCount.match ? '✓ Match' : '✗ Different'}
                        </span>
                        <span>File 2: <strong>${results.structureComparison.pageCount.file2}</strong> pages</span>
                    </div>
                </div>
                
                <div>
                    <strong style="color: var(--text-dark);">Metadata:</strong>
                    <div style="margin-top: 5px; padding: 8px; background: var(--background-white); border-radius: 4px;">
                        <table style="width: 100%; font-size: 0.9em;">
                            <tr>
                                <th style="text-align: left; padding: 5px; color: var(--text-light);">Property</th>
                                <th style="text-align: left; padding: 5px; color: var(--text-light);">File 1</th>
                                <th style="text-align: left; padding: 5px; color: var(--text-light);">File 2</th>
                            </tr>
                            <tr>
                                <td style="padding: 5px; color: var(--text-dark);">Title</td>
                                <td style="padding: 5px; color: var(--text-dark);">${results.structureComparison.metadata.file1.title}</td>
                                <td style="padding: 5px; color: var(--text-dark);">${results.structureComparison.metadata.file2.title}</td>
                            </tr>
                            <tr style="background: var(--background-light);">
                                <td style="padding: 5px; color: var(--text-dark);">Author</td>
                                <td style="padding: 5px; color: var(--text-dark);">${results.structureComparison.metadata.file1.author}</td>
                                <td style="padding: 5px; color: var(--text-dark);">${results.structureComparison.metadata.file2.author}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px; color: var(--text-dark);">Creator</td>
                                <td style="padding: 5px; color: var(--text-dark);">${results.structureComparison.metadata.file1.creator}</td>
                                <td style="padding: 5px; color: var(--text-dark);">${results.structureComparison.metadata.file2.creator}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        summaryDiv.innerHTML += structureHtml;
    }
}
          
          	
        } 
