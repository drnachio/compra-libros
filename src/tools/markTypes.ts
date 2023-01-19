export interface MARKMetadata {
  RecordReference: string;
  NotificationType: number;
  ProductIdentifier: {
    ProductIDType: number;
    IDValue: number;
  }[];
  ProductForm: string;
  ProductFormDetail: string;
  ProductFormFeature: {
    ProductFormFeatureType: number;
  };
  Series: {
    Title: {
      TitleType: number;
      TitleText: string;
    };
  }[];
  Title: {
    TitleType: number;
    TitleText: string;
  }[];
  Contributor: {
    SequenceNumber: number;
    ContributorRole: string;
    PersonName?: string;
    PersonNameInverted: string;
    NamesBeforeKey?: string;
    KeyNames?: string;
    BiographicalNote?: string;
    PersonNameIdentifier: {
      PersonNameIDType: number;
      IDTypeName: string;
      IDValue: number;
    }[];
  }[];
  NoEdition: string;
  Language: {
    LanguageRole: number;
    LanguageCode: string;
  }[];
  NumberOfPages: number;
  Extent: {
    ExtentType: number;
    ExtentValue: number;
    ExtentUnit: number;
  }[];
  MainSubject: {
    MainSubjectSchemeIdentifier: number;
    SubjectSchemeVersion: number;
    SubjectCode: string;
  }[];
  Subject: {
    SubjectSchemeIdentifier: number;
    SubjectSchemeName: string;
    SubjectCode: number;
    SubjectHeadingText: string;
  }[];
  AudienceCode: number;
  OtherText: {
    TextTypeCode: number;
    Text: string;
  }[];
  MediaFile: {
    MediaFileTypeCode: number;
    MediaFileFormatCode?: number;
    MediaFileLinkTypeCode: number;
    MediaFileLink: string;
    MediaFileDate: number;
  }[];
  Imprint: {
    NameCodeType?: number;
    NameCodeTypeName?: string;
    NameCodeValue?: string;
    ImprintName: string;
  }[];
  Publisher: {
    PublishingRole: number;
    NameCodeType: number;
    NameCodeTypeName: string;
    NameCodeValue: string;
    PublisherName: string;
    Website?: {
      WebsiteRole: number;
      WebsiteLink: string;
    }[];
  }[];
  CityOfPublication?: string;
  CountryOfPublication?: string;
  PublishingStatus: number;
  PublicationDate: number;
  SalesRights: {
    SalesRightsType: number;
    RightsCountry: string;
  }[];
  Measure: {
    MeasureTypeCode: number,
    Measurement: number,
    MeasureUnitCode: string;
  }[];
  RelatedProduct: {
    RelationCode: number;
    ProductIdentifier: {
      ProductIDType: number;
      IDValue: number;
    }[];
  }[];
  SupplyDetail: {
    SupplierName: string;
    SupplierRole: number;
    SupplyToCountry: string;
    SupplyRestrictionDetail: string;
    ProductAvailability: number;
    OnSaleDate: number;
    Price: {
      PriceTypeCode: number,
      PriceAmount: number,
      CurrencyCode: string,
      CountryCode: string,
      TaxRateCode1: string,
      TaxRatePercent1: number,
      TaxableAmount1: number,
    }[]
  }[];
}
