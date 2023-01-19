export interface MARKMetadata {
  RecordReference: string;
  NotificationType: number;
  ProductIdentifier: {
    ProductIDType: number;
    IDValue: number;
  }[];
  ProductForm: string;
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
  MainSubject: {
    MainSubjectSchemeIdentifier: number;
    SubjectSchemeVersion: number;
    SubjectCode: string;
  }[];
}
