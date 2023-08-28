import { Module } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { ProductReviewResolver } from './product-review.resolver';

@Module({
  providers: [ProductReviewService, ProductReviewResolver]
})
export class ProductReviewModule {}
