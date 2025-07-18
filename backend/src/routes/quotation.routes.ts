import { Router } from 'express';
import { QuotationController } from '../controllers/quotation.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { 
  createQuotationSchema,
  quickQuoteSchema,
  getUserQuotationsSchema,
  estimatePriceSchema,
  getQuotationSchema,
  acceptQuotationSchema
} from '../validators/quotation.validator';

const router = Router();
const quotationController = new QuotationController();

// Public routes
router.get(
  '/services',
  quotationController.getServices
);

router.get(
  '/quick-quote',
  validate(quickQuoteSchema),
  quotationController.quickQuote
);

router.get(
  '/estimate',
  validate(estimatePriceSchema),
  quotationController.estimatePrice
);

router.get(
  '/:quotationId',
  validate(getQuotationSchema),
  quotationController.getQuotation
);

router.get(
  '/:quotationId/whatsapp',
  validate(getQuotationSchema),
  quotationController.getQuotationWhatsApp
);

// Authenticated routes
router.use(authenticate);

router.post(
  '/',
  validate(createQuotationSchema),
  quotationController.createQuotation
);

router.get(
  '/user/quotations',
  validate(getUserQuotationsSchema),
  quotationController.getUserQuotations
);

router.post(
  '/:quotationId/accept',
  validate(acceptQuotationSchema),
  quotationController.acceptQuotation
);

export default router;