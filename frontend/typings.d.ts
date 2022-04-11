export interface IImageItem {
  data: {
    attributes: {
      url: string;
    }
  }
}

export interface IImageList {
  data: {
    attributes: {
      url: string;
    }
  }[]
}

export interface IRestaurantList {
  restaurants: {
    data: IRestaurant[]
  }
}

export interface IRestaurant {
  id: string;
  attributes: {
    name: string;
    description: string;
    image: IImageList;
  }
}

export interface IDish {
  id: string;
  attributes: {
    name: string;
    description: string;
    price: number;
    image: IImageItem;
  }
}

export interface IRestaurantDetails {
  restaurant: {
    data: {
      id: string;
      attributes: {
        name: string;
        dishes: {
          data: IDish[];
        }
      }
    }
  }
}

export interface ICartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ICart {
  items: ICartItem[];
  total: number;
}

export interface ICheckoutInfo {
  address: string;
  city: string;
  state: string;
  stripe_id: string;
}
