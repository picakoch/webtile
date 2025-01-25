import type { Attribute, Schema } from '@strapi/strapi';

export interface MainTile extends Schema.Component {
  collectionName: 'components_main_tiles';
  info: {
    description: '';
    displayName: 'tile';
    icon: 'book';
  };
  attributes: {
    date: Attribute.Date & Attribute.Required;
    image: Attribute.Media<'images'> & Attribute.Required;
    large: Attribute.Boolean & Attribute.DefaultTo<false>;
    tags: Attribute.Relation<'main.tile', 'oneToMany', 'api::tag.tag'>;
    title: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'main.tile': MainTile;
    }
  }
}
