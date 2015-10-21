/**
 * @fileOverview
 *
 * This file contains the Categories model unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import scoutModule from './scout';

import resolveUrl from "resolve-url";
import iconv from 'iconv-lite';
import FeedParser from 'feedparser';
import Stream from 'stream';

describe("Scout", () => {
    let rootScope, q, http, httpBackend, Scout;

    //let atomXml = jetpack.read('./core/helpers/spec_assets/atom.xml');
    //let rss2Xml = jetpack.read('./core/helpers/spec_assets/rss2.xml');

    let rss2Xml = '<?xml version="1.0" encoding="UTF-8" ?> <rss version="2.0"> <channel> <title>RSS Title</title>'
        + '<description>This is an example of an RSS feed</description>'
        + '<link>http://www.example.com/main.html</link>'
        + '<lastBuildDate>Mon, 06 Sep 2010 00:01:00 +0000 </lastBuildDate>'
        + '<pubDate>Sun, 06 Sep 2009 16:20:00 +0000</pubDate>'
        + '<ttl>1800</ttl>'
        + '<item>'
        + '<title>Example entry</title>'
        + '<description>Here is some text containing an interesting description.</description>'
        + '<link>http://www.example.com/blog/post/1</link>'
        + '<guid>7bd204c6-1655-4c27-aeee-53f933c5395f</guid>'
        + '<pubDate>Sun, 06 Sep 2009 16:20:00 +0000</pubDate>'
        + '</item>'
        + '</channel>'
        + '</rss>';


    let atomXml = '<?xml version="1.0" encoding="utf-8"?>'
        + '<feed xmlns="http://www.w3.org/2005/Atom">'
        + '<title>Example Feed</title>'
        + '<subtitle>A subtitle.</subtitle>'
        + '<link href="http://example.org/feed/" rel="self" />'
        + '<link href="http://example.org/" />'
        + '<id>urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6</id>'
        + '<updated>2003-12-13T18:30:02Z</updated>'
        + '<entry>'
        + '<title>Atom-Powered Robots Run Amok</title>'
        + '<link href="http://example.org/2003/12/13/atom03" />'
        + '<link rel="alternate" type="text/html" href="http://example.org/2003/12/13/atom03.html"/>'
        + '<link rel="edit" href="http://example.org/2003/12/13/atom03/edit"/>'
        + '<id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>'
        + '<updated>2003-12-13T18:30:02Z</updated>'
        + '<summary>Some text.</summary>'
        + '<content type="xhtml">'
        + '<div xmlns="http://www.w3.org/1999/xhtml">'
        + '<p>This is the entry content.</p>'
        + '</div>'
        + '</content>'
        + '<author>'
        + '<name>John Doe</name>'
        + '<email>johndoe@example.com</email>'
        + '</author>'
        + '</entry>'
        + '</feed>';


    let htmlLinkAtom = '<html><head><link href="http://atom-xml" type="application/atom+xml"></head><body></body></html>';
    let htmlLinkRss = '<html><head><link href="http://rss2-xml" type="application/rss+xml"></head><body></body></html>';
    // Sometimes relative links are given
    let htmlLinkRelativeRss = '<html><head><link href="/rss2-xml" type="application/rss+xml"></head><body></body></html>';
    // HTML has link to RSS, but this link returns invalid RSS
    let htmlLinkHtml = '<html><head><link href="http://html-link-rss" type="application/rss+xml"></head><body></body></html>';
    let htmlNoLink = '<html><head></head><body></body></html>';
    // HTML has link to RSS, but this link returns 404
    let htmlLink404 = '<html><head><link href="http://404" type="application/rss+xml"></head><body></body></html>';

    // Use to inject the code under test
    function _inject(done) {
        inject((_$rootScope_, _$q_, _$http_, _$httpBackend_, _Scout_) => {
            rootScope = _$rootScope_;
            q = _$q_;
            http = _$http_;
            httpBackend = _$httpBackend_;
            Scout = _Scout_;

            done();
        });
    }

    // Call this before each test, except where you are testing for errors
    let _setup = done => _inject(done);

    // Clean your mess
    function _tearDown() {

    }

    // Init the module before each test case
    beforeEach(() => angular.mock.module(scoutModule.name));

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));

    describe("findFeedUrlInHtml(body, url)", () => {

        beforeEach(done => _setup(done));

        it("should find absolute rss-url in html", function () {
            expect(Scout.findFeedUrlInHtml(htmlLinkRss, 'http://htmlLinkRss')).toEqual('http://rss2-xml');
        });

        it("should find relative rss-url in html and resolve final url", function () {
            expect(Scout.findFeedUrlInHtml(htmlLinkRelativeRss, 'http://rss2-xml')).toEqual('http://rss2-xml/rss2-xml');
        });


    });

    describe("fetch()", () => {

        beforeEach(done => _setup(done));

        it("should deal with RSS XML", function () {
            httpBackend.whenGET("http://rss2-xml").respond(rss2Xml);
            Scout.fetch('http://rss2-xml').then((feedUrl) => {
                expect(feedUrl.data).toBe(rss2Xml);
            });
            httpBackend.flush();
        });

        it("should return null if 404", function () {
            httpBackend.whenGET("http://404").respond(404);
            Scout.fetch('http://404').catch((feedUrl) => {
                expect(feedUrl.status).toBe(404);
            });
            httpBackend.flush();
        });
    });

    xdescribe("parse()", () => {

        beforeEach(done => _setup(done));

        it("should parse RSSv2 feed", () => {
            Scout.parse(rss2Xml).then((result) => {
                expect(result.meta.title).toBe('RSS Title');
                expect(result.meta.link).toBe('http://www.example.com/main.htmls');
                expect(result.articles.length).toBe(1);
                expect(result.articles[0].title).toBe('Example entry');

            }).catch((e) => {
                console.log(e);
            });
        });
    });
});
