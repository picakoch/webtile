import type { Schema, Struct } from '@strapi/strapi';

export interface MainTile extends Struct.ComponentSchema {
  collectionName: 'components_main_tiles';
  info: {
    description: '';
    displayName: 'tile';
    icon: 'book';
  };
  attributes: {
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    large: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    tags: Schema.Attribute.Relation<'oneToMany', 'api::tag.tag'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'main.tile': MainTile;
    }
  }
}
