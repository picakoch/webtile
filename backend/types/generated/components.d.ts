import type { Schema, Attribute } from '@strapi/strapi';

export interface MainTile extends Schema.Component {
  collectionName: 'components_main_tiles';
  info: {
    displayName: 'tile';
    icon: 'book';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    image: Attribute.Media & Attribute.Required;
    tags: Attribute.Relation<'main.tile', 'oneToMany', 'api::tag.tag'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'main.tile': MainTile;
    }
  }
}
