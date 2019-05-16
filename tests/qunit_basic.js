QUnit.test("Is the TheFragebogen.js correctly loaded?", function(assert) {
    assert.ok(TheFragebogen !== undefined);
});
QUnit.test("Is TheFragebogen.logger available?", function(assert) {
    TheFragebogen.logger.info("test", "This is just a message to test the logger.");
    assert.ok(true);
});
