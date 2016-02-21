/* */ 
try {
  var asn1 = require('../../lib/asn1');
} catch (e) {
  var asn1 = require('../../lib/asn1');
}
var rfc5280 = exports;
var x509OIDs = {
  '2 5 29 9': 'subjectDirectoryAttributes',
  '2 5 29 14': 'subjectKeyIdentifier',
  '2 5 29 15': 'keyUsage',
  '2 5 29 17': 'subjectAlternativeName',
  '2 5 29 18': 'issuerAlternativeName',
  '2 5 29 19': 'basicConstraints',
  '2 5 29 20': 'cRLNumber',
  '2 5 29 21': 'reasonCode',
  '2 5 29 24': 'invalidityDate',
  '2 5 29 27': 'deltaCRLIndicator',
  '2 5 29 28': 'issuingDistributionPoint',
  '2 5 29 29': 'certificateIssuer',
  '2 5 29 30': 'nameConstraints',
  '2 5 29 31': 'cRLDistributionPoints',
  '2 5 29 32': 'certificatePolicies',
  '2 5 29 33': 'policyMappings',
  '2 5 29 35': 'authorityKeyIdentifier',
  '2 5 29 36': 'policyConstraints',
  '2 5 29 37': 'extendedKeyUsage',
  '2 5 29 46': 'freshestCRL',
  '2 5 29 54': 'inhibitAnyPolicy',
  '1 3 6 1 5 5 7 1 1': 'authorityInformationAccess',
  '1 3 6 1 5 5 7 11': 'subjectInformationAccess'
};
var CertificateList = asn1.define('CertificateList', function() {
  this.seq().obj(this.key('tbsCertList').use(TBSCertList), this.key('signatureAlgorithm').use(AlgorithmIdentifier), this.key('signature').bitstr());
});
rfc5280.CerficateList = CertificateList;
var AlgorithmIdentifier = asn1.define('AlgorithmIdentifier', function() {
  this.seq().obj(this.key('algorithm').objid(), this.key('parameters').optional().any());
});
rfc5280.AlgorithmIdentifier = AlgorithmIdentifier;
var Certificate = asn1.define('Certificate', function() {
  this.seq().obj(this.key('tbsCertificate').use(TBSCertificate), this.key('signatureAlgorithm').use(AlgorithmIdentifier), this.key('signature').bitstr());
});
rfc5280.Certificate = Certificate;
var TBSCertificate = asn1.define('TBSCertificate', function() {
  this.seq().obj(this.key('version').def('v1').explicit(0).use(Version), this.key('serialNumber').int(), this.key('signature').use(AlgorithmIdentifier), this.key('issuer').use(Name), this.key('validity').use(Validity), this.key('subject').use(Name), this.key('subjectPublicKeyInfo').use(SubjectPublicKeyInfo), this.key('issuerUniqueID').optional().explicit(1).bitstr(), this.key('subjectUniqueID').optional().explicit(2).bitstr(), this.key('extensions').optional().explicit(3).seqof(Extension));
});
rfc5280.TBSCertificate = TBSCertificate;
var Version = asn1.define('Version', function() {
  this.int({
    0: 'v1',
    1: 'v2',
    2: 'v3'
  });
});
rfc5280.Version = Version;
var Validity = asn1.define('Validity', function() {
  this.seq().obj(this.key('notBefore').use(Time), this.key('notAfter').use(Time));
});
rfc5280.Validity = Validity;
var Time = asn1.define('Time', function() {
  this.choice({
    utcTime: this.utctime(),
    genTime: this.gentime()
  });
});
rfc5280.Time = Time;
var SubjectPublicKeyInfo = asn1.define('SubjectPublicKeyInfo', function() {
  this.seq().obj(this.key('algorithm').use(AlgorithmIdentifier), this.key('subjectPublicKey').bitstr());
});
rfc5280.SubjectPublicKeyInfo = SubjectPublicKeyInfo;
var TBSCertList = asn1.define('TBSCertList', function() {
  this.seq().obj(this.key('version').optional().int(), this.key('signature').use(AlgorithmIdentifier), this.key('issuer').use(Name), this.key('thisUpdate').use(Time), this.key('nextUpdate').use(Time), this.key('revokedCertificates').optional().seq().obj(this.seq().obj(this.key('userCertificate').int(), this.key('revocationDate').use(Time), this.key('crlEntryExtensions').optional().seqof(Extension))), this.key('crlExtensions').implicit(0).optional().seqof(Extension));
});
rfc5280.TBSCertList = TBSCertList;
var Extension = asn1.define('Extension', function() {
  this.seq().obj(this.key('extnID').objid(x509OIDs), this.key('critical').bool().def(false), this.key('extnValue').octstr().contains(function(obj) {
    var out = x509Extensions[obj.extnID];
    return out ? out : asn1.define('OctString', function() {
      this.any();
    });
  }));
});
rfc5280.Extension = Extension;
var Name = asn1.define('Name', function() {
  this.choice({rdnSequence: this.use(RDNSequence)});
});
rfc5280.Name = Name;
var GeneralName = asn1.define('GeneralName', function() {
  this.choice({
    otherName: this.implicit(0).use(AnotherName),
    rfc822Name: this.implicit(1).ia5str(),
    dNSName: this.implicit(2).ia5str(),
    directoryName: this.explicit(4).use(Name),
    ediPartyName: this.implicit(5).use(EDIPartyName),
    uniformResourceIdentifier: this.implicit(6).ia5str(),
    iPAddress: this.implicit(7).octstr(),
    registeredID: this.implicit(8).objid()
  });
});
rfc5280.GeneralName = GeneralName;
var GeneralNames = asn1.define('GeneralNames', function() {
  this.seqof(GeneralName);
});
rfc5280.GeneralNames = GeneralNames;
var AnotherName = asn1.define('AnotherName', function() {
  this.seq().obj(this.key('type-id').objid(), this.key('value').explicit(0).any());
});
rfc5280.AnotherName = AnotherName;
var EDIPartyName = asn1.define('EDIPartyName', function() {
  this.seq().obj(this.key('nameAssigner').implicit(0).optional().use(DirectoryString), this.key('partyName').implicit(1).use(DirectoryString));
});
rfc5280.EDIPartyName = EDIPartyName;
var RDNSequence = asn1.define('RDNSequence', function() {
  this.seqof(RelativeDistinguishedName);
});
rfc5280.RDNSequence = RDNSequence;
var RelativeDistinguishedName = asn1.define('RelativeDistinguishedName', function() {
  this.setof(AttributeTypeAndValue);
});
rfc5280.RelativeDistinguishedName = RelativeDistinguishedName;
var AttributeTypeAndValue = asn1.define('AttributeTypeAndValue', function() {
  this.seq().obj(this.key('type').use(AttributeType), this.key('value').use(AttributeValue));
});
rfc5280.AttributeTypeAndValue = AttributeTypeAndValue;
var Attribute = asn1.define('Attribute', function() {
  this.seq().obj(this.key('type').use(AttributeType), this.key('values').setof(AttributeValue));
});
rfc5280.Attribute = Attribute;
var AttributeType = asn1.define('AttributeType', function() {
  this.objid();
});
rfc5280.AttributeType = AttributeType;
var AttributeValue = asn1.define('AttributeValue', function() {
  this.any();
});
rfc5280.AttributeValue = AttributeValue;
var DirectoryString = asn1.define('DirectoryString', function() {
  this.choice({
    teletexString: this.t61str(),
    printableString: this.printstr(),
    universalString: this.unistr(),
    utf8String: this.utf8str(),
    bmpString: this.bmpstr()
  });
});
rfc5280.DirectoryString = DirectoryString;
var AuthorityKeyIdentifier = asn1.define('AuthorityKeyIdentifier', function() {
  this.seq().obj(this.key('keyIdentifier').optional().use(KeyIdentifier), this.key('authorityCertIssuer').optional().use(GeneralNames), this.key('authorityCertSerialNumber').optional().use(CertificateSerialNumber));
});
rfc5280.AuthorityKeyIdentifier = AuthorityKeyIdentifier;
var KeyIdentifier = asn1.define('KeyIdentifier', function() {
  this.octstr();
});
rfc5280.KeyIdentifier = KeyIdentifier;
var CertificateSerialNumber = asn1.define('CertificateSerialNumber', function() {
  this.int();
});
rfc5280.CertificateSerialNumber = CertificateSerialNumber;
var ORAddress = asn1.define('ORAddress', function() {
  this.seq().obj(this.key('builtInStandardAttributes').use(BuiltInStandardAttributes), this.key('builtInDomainDefinedAttributes').optional().use(BuiltInDomainDefinedAttributes), this.key('extensionAttributes').optional().use(ExtensionAttributes));
});
rfc5280.ORAddress = ORAddress;
var BuiltInStandardAttributes = asn1.define('BuiltInStandardAttributes', function() {
  this.seq().obj(this.key('countryName').optional().use(CountryName), this.key('administrationDomainName').optional().use(AdministrationDomainName), this.key('networkAddress').optional().use(NetworkAddress), this.key('terminalIdentifier').optional().use(TerminalIdentifier), this.key('privateDomainName').optional().use(PrivateDomainName), this.key('organizationName').optional().use(OrganizationName), this.key('numericUserIdentifier').optional().use(NumericUserIdentifier), this.key('personalName').optional().use(PersonalName), this.key('organizationalUnitNames').optional().use(OrganizationalUnitNames));
});
rfc5280.BuiltInStandardAttributes = BuiltInStandardAttributes;
var CountryName = asn1.define('CountryName', function() {
  this.choice({
    x121DccCode: this.numstr(),
    iso3166Alpha2Code: this.printstr()
  });
});
rfc5280.CountryName = CountryName;
var AdministrationDomainName = asn1.define('AdministrationDomainName', function() {
  this.choice({
    numeric: this.numstr(),
    printable: this.printstr()
  });
});
rfc5280.AdministrationDomainName = AdministrationDomainName;
var NetworkAddress = asn1.define('NetworkAddress', function() {
  this.use(X121Address);
});
rfc5280.NetworkAddress = NetworkAddress;
var X121Address = asn1.define('X121Address', function() {
  this.numstr();
});
rfc5280.X121Address = X121Address;
var TerminalIdentifier = asn1.define('TerminalIdentifier', function() {
  this.printstr();
});
rfc5280.TerminalIdentifier = TerminalIdentifier;
var PrivateDomainName = asn1.define('PrivateDomainName', function() {
  this.choice({
    numeric: this.numstr(),
    printable: this.printstr()
  });
});
rfc5280.PrivateDomainName = PrivateDomainName;
var OrganizationName = asn1.define('OrganizationName', function() {
  this.printstr();
});
rfc5280.OrganizationName = OrganizationName;
var NumericUserIdentifier = asn1.define('NumericUserIdentifier', function() {
  this.numstr();
});
rfc5280.NumericUserIdentifier = NumericUserIdentifier;
var PersonalName = asn1.define('PersonalName', function() {
  this.set().obj(this.key('surname').implicit().printstr(), this.key('givenName').implicit().printstr(), this.key('initials').implicit().printstr(), this.key('generationQualifier').implicit().printstr());
});
rfc5280.PersonalName = PersonalName;
var OrganizationalUnitNames = asn1.define('OrganizationalUnitNames', function() {
  this.seqof(OrganizationalUnitName);
});
rfc5280.OrganizationalUnitNames = OrganizationalUnitNames;
var OrganizationalUnitName = asn1.define('OrganizationalUnitName', function() {
  this.printstr();
});
rfc5280.OrganizationalUnitName = OrganizationalUnitName;
var BuiltInDomainDefinedAttributes = asn1.define('BuiltInDomainDefinedAttributes', function() {
  this.seqof(BuiltInDomainDefinedAttribute);
});
rfc5280.BuiltInDomainDefinedAttributes = BuiltInDomainDefinedAttributes;
var BuiltInDomainDefinedAttribute = asn1.define('BuiltInDomainDefinedAttribute', function() {
  this.seq().obj(this.key('type').printstr(), this.key('value').printstr());
});
rfc5280.BuiltInDomainDefinedAttribute = BuiltInDomainDefinedAttribute;
var ExtensionAttributes = asn1.define('ExtensionAttributes', function() {
  this.seqof(ExtensionAttribute);
});
rfc5280.ExtensionAttributes = ExtensionAttributes;
var ExtensionAttribute = asn1.define('ExtensionAttribute', function() {
  this.seq().obj(this.key('extensionAttributeType').implicit().int(), this.key('extensionAttributeValue').any().implicit().int());
});
rfc5280.ExtensionAttribute = ExtensionAttribute;
var SubjectKeyIdentifier = asn1.define('SubjectKeyIdentifier', function() {
  this.use(KeyIdentifier);
});
rfc5280.SubjectKeyIdentifier = SubjectKeyIdentifier;
var KeyUsage = asn1.define('KeyUsage', function() {
  this.bitstr();
});
rfc5280.KeyUsage = KeyUsage;
var CertificatePolicies = asn1.define('CertificatePolicies', function() {
  this.seqof(PolicyInformation);
});
rfc5280.CertificatePolicies = CertificatePolicies;
var PolicyInformation = asn1.define('PolicyInformation', function() {
  this.seq().obj(this.key('policyIdentifier').use(CertPolicyId), this.key('policyQualifiers').optional().use(PolicyQualifiers));
});
rfc5280.PolicyInformation = PolicyInformation;
var CertPolicyId = asn1.define('CertPolicyId', function() {
  this.objid();
});
rfc5280.CertPolicyId = CertPolicyId;
var PolicyQualifiers = asn1.define('PolicyQualifiers', function() {
  this.seqof(PolicyQualifierInfo);
});
rfc5280.PolicyQualifiers = PolicyQualifiers;
var PolicyQualifierInfo = asn1.define('PolicyQualifierInfo', function() {
  this.seq().obj(this.key('policyQualifierId').use(PolicyQualifierId), this.key('qualifier').any().use(PolicyQualifierId));
});
rfc5280.PolicyQualifierInfo = PolicyQualifierInfo;
var PolicyQualifierId = asn1.define('PolicyQualifierId', function() {
  this.objid();
});
rfc5280.PolicyQualifierId = PolicyQualifierId;
var PolicyMappings = asn1.define('PolicyMappings', function() {
  this.seqof(PolicyMapping);
});
rfc5280.PolicyMappings = PolicyMappings;
var PolicyMapping = asn1.define('PolicyMapping', function() {
  this.seq().obj(this.key('issuerDomainPolicy').use(CertPolicyId), this.key('subjectDomainPolicy').use(CertPolicyId));
});
rfc5280.PolicyMapping = PolicyMapping;
var SubjectAlternativeName = asn1.define('SubjectAlternativeName', function() {
  this.use(GeneralNames);
});
rfc5280.SubjectAlternativeName = SubjectAlternativeName;
var IssuerAlternativeName = asn1.define('IssuerAlternativeName', function() {
  this.use(GeneralNames);
});
rfc5280.IssuerAlternativeName = IssuerAlternativeName;
var SubjectDirectoryAttributes = asn1.define('SubjectDirectoryAttributes', function() {
  this.seqof(Attribute);
});
rfc5280.SubjectDirectoryAttributes = SubjectDirectoryAttributes;
var BasicConstraints = asn1.define('BasicConstraints', function() {
  this.seq().obj(this.key('cA').bool().def(false), this.key('pathLenConstraint').optional().int());
});
rfc5280.BasicConstraints = BasicConstraints;
var NameConstraints = asn1.define('NameConstraints', function() {
  this.seq().obj(this.key('permittedSubtrees').implicit(0).optional().use(GeneralSubtrees), this.key('excludedSubtrees').implicit(1).optional().use(GeneralSubtrees));
});
rfc5280.NameConstraints = NameConstraints;
var GeneralSubtrees = asn1.define('GeneralSubtrees', function() {
  this.seqof(GeneralSubtree);
});
rfc5280.GeneralSubtrees = GeneralSubtrees;
var GeneralSubtree = asn1.define('GeneralSubtree', function() {
  this.seq().obj(this.key('base').use(GeneralName), this.key('minimum').default(0).use(BaseDistance), this.key('maximum').optional().use(BaseDistance));
});
rfc5280.GeneralSubtree = GeneralSubtree;
var BaseDistance = asn1.define('BaseDistance', function() {
  this.int();
});
rfc5280.BaseDistance = BaseDistance;
var PolicyConstraints = asn1.define('PolicyConstraints', function() {
  this.seq().obj(this.key('requireExplicitPolicy').implicit(0).optional().use(SkipCerts), this.key('inhibitPolicyMapping').implicit(1).optional().use(SkipCerts));
});
rfc5280.PolicyConstraints = PolicyConstraints;
var SkipCerts = asn1.define('SkipCerts', function() {
  this.int();
});
rfc5280.SkipCerts = SkipCerts;
var ExtendedKeyUsage = asn1.define('ExtendedKeyUsage', function() {
  this.seqof(KeyPurposeId);
});
rfc5280.ExtendedKeyUsage = ExtendedKeyUsage;
var KeyPurposeId = asn1.define('KeyPurposeId', function() {
  this.objid();
});
rfc5280.KeyPurposeId = KeyPurposeId;
var CRLDistributionPoints = asn1.define('CRLDistributionPoints', function() {
  this.seqof(DistributionPoint);
});
rfc5280.CRLDistributionPoints = CRLDistributionPoints;
var DistributionPoint = asn1.define('DistributionPoint', function() {
  this.seq().obj(this.key('distributionPoint').optional().use(DistributionPointName), this.key('reasons').optional().use(ReasonFlags), this.key('cRLIssuer').optional().use(GeneralNames));
});
rfc5280.DistributionPoint = DistributionPoint;
var DistributionPointName = asn1.define('DistributionPointName', function() {
  this.choice({
    fullName: this.implicit(0).use(GeneralNames),
    nameRelativeToCRLIssuer: this.implicit(1).use(RelativeDistinguishedName)
  });
});
rfc5280.DistributionPointName = DistributionPointName;
var ReasonFlags = asn1.define('ReasonFlags', function() {
  this.bitstr();
});
rfc5280.ReasonFlags = ReasonFlags;
var InhibitAnyPolicy = asn1.define('InhibitAnyPolicy', function() {
  this.use(SkipCerts);
});
rfc5280.InhibitAnyPolicy = InhibitAnyPolicy;
var FreshestCRL = asn1.define('FreshestCRL', function() {
  this.use(CRLDistributionPoints);
});
rfc5280.FreshestCRL = FreshestCRL;
var AuthorityInfoAccessSyntax = asn1.define('AuthorityInfoAccessSyntax', function() {
  this.seqof(AccessDescription);
});
rfc5280.AuthorityInfoAccessSyntax = AuthorityInfoAccessSyntax;
var AccessDescription = asn1.define('AccessDescription', function() {
  this.seq().obj(this.key('accessMethod').objid(), this.key('accessLocation').use(GeneralName));
});
rfc5280.AccessDescription = AccessDescription;
var SubjectInformationAccess = asn1.define('SubjectInformationAccess', function() {
  this.seqof(AccessDescription);
});
rfc5280.SubjectInformationAccess = SubjectInformationAccess;
var CRLNumber = asn1.define('CRLNumber', function() {
  this.int();
});
rfc5280.CRLNumber = CRLNumber;
var DeltaCRLIndicator = asn1.define('DeltaCRLIndicator', function() {
  this.use(CRLNumber);
});
rfc5280.DeltaCRLIndicator = DeltaCRLIndicator;
var IssuingDistributionPoint = asn1.define('IssuingDistributionPoint', function() {
  this.seq().obj(this.key('distributionPoint').use(DistributionPointName), this.key('onlyContainsUserCerts').def(false).bool(), this.key('onlyContainsCACerts').def(false).bool(), this.key('onlySomeReasons').use(ReasonFlags), this.key('indirectCRL').def(false).bool(), this.key('onlyContainsAttributeCerts').def(false).bool());
});
rfc5280.IssuingDistributionPoint = IssuingDistributionPoint;
var ReasonCode = asn1.define('ReasonCode', function() {
  this.enum();
});
rfc5280.ReasonCode = ReasonCode;
var InvalidityDate = asn1.define('InvalidityDate', function() {
  this.gentime();
});
rfc5280.InvalidityDate = InvalidityDate;
var CertificateIssuer = asn1.define('CertificateIssuer', function() {
  this.use(GeneralNames);
});
rfc5280.CertificateIssuer = CertificateIssuer;
var x509Extensions = {
  subjectDirectoryAttributes: SubjectDirectoryAttributes,
  subjectKeyIdentifier: SubjectKeyIdentifier,
  keyUsage: KeyUsage,
  subjectAlternativeName: SubjectAlternativeName,
  issuerAlternativeName: IssuerAlternativeName,
  basicConstraints: BasicConstraints,
  cRLNumber: CRLNumber,
  reasonCode: ReasonCode,
  invalidityDate: InvalidityDate,
  deltaCRLIndicator: DeltaCRLIndicator,
  issuingDistributionPoint: IssuingDistributionPoint,
  certificateIssuer: CertificateIssuer,
  nameConstraints: NameConstraints,
  cRLDistributionPoints: CRLDistributionPoints,
  certificatePolicies: CertificatePolicies,
  policyMappings: PolicyMappings,
  authorityKeyIdentifier: AuthorityKeyIdentifier,
  policyConstraints: PolicyConstraints,
  extendedKeyUsage: ExtendedKeyUsage,
  freshestCRL: FreshestCRL,
  inhibitAnyPolicy: InhibitAnyPolicy,
  authorityInformationAccess: AuthorityInfoAccessSyntax,
  subjectInformationAccess: SubjectInformationAccess
};
