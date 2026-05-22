type Ingredient = {
  id: string;
  is_in_taxonomy: number;
  percent_estimate: number;
  percent_max: number;
  percent_min: number;
  text: string;
};

type ProductData = {
  product_name: string;
  additives_tags: string[];
  allergens_tags: string[];
  ingredients: Ingredient[];
};

export interface IOpenFoodProduct {
  code: string;
  product: ProductData;
  status: number;
  status_verbose: string;
}

export interface IImageArray {
  data: Uint8ClampedArray | number[];
  w: number;
  h: number;
}
