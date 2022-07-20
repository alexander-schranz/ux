/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import { Application } from '@hotwired/stimulus';
import {fireEvent, getByTestId, getByText, waitFor} from '@testing-library/dom';
import { clearDOM, mountDOM } from '@symfony/stimulus-testing';
import CollectionController from '../src/controller';

const startStimulus = () => {
    const application = Application.start();
    application.register('symfony--ux-collection--collection', CollectionController);
};

const emptyCollection = '<div data-testid="collection" data-controller="symfony--ux-collection--collection"></div>';

const simpleCollectionWithoutButtons = '' +
    '<form name="game" method="post" data-controller="symfony--ux-collection--collection">' +
    '   <div id="game">' +
    '       <div>' +
    '           <label class="required">Teams</label>' +
    '           <div id="game_teams" data-prototype="&lt;div class=&quot;team-entry&quot;&gt;&lt;label class=&quot;required&quot;&gt;__name__label__&lt;/label&gt;&lt;div id=&quot;game_teams___name__&quot;&gt;&lt;div&gt;&lt;label for=&quot;game_teams___name___name&quot; class=&quot;required&quot;&gt;Name&lt;/label&gt;&lt;input type=&quot;text&quot; id=&quot;game_teams___name___name&quot; name=&quot;game[teams][__name__][name]&quot; required=&quot;required&quot; data-controller=&quot;test&quot; /&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;">' +
    '           </div>' +
    '       </div>' +
    '   <div>' +
    '   <button type="submit" id="game_submit" name="game[submit]">Submit</button>' +
    '   </div>' +
    '</form>'

const simpleCollection = '' +
    '    <template id="addButton">' +
    '        <button type="button" class="add-button">Add button</button>' +
    '    </template>' +
    '' +
    '    <template id="deleteButton">' +
    '        <button type="button" class="delete-button">Delete button</button>' +
    '    </template>' +
    '' +
    '<form name="game" method="post" data-controller="symfony--ux-collection--collection" data-add-button="addButton" data-delete-button="deleteButton">' +
    '   <div id="game">' +
    '       <div>' +
    '           <label class="required">Teams</label>' +
    '           <div id="game_teams" data-prototype="&lt;div class=&quot;team-entry&quot;&gt;&lt;label class=&quot;required&quot;&gt;__name__label__&lt;/label&gt;&lt;div id=&quot;game_teams___name__&quot;&gt;&lt;div&gt;&lt;label for=&quot;game_teams___name___name&quot; class=&quot;required&quot;&gt;Name&lt;/label&gt;&lt;input type=&quot;text&quot; id=&quot;game_teams___name___name&quot; name=&quot;game[teams][__name__][name]&quot; required=&quot;required&quot; data-controller=&quot;test&quot; /&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;">' +
    '           </div>' +
    '       </div>' +
    '   <div>' +
    '   <button type="submit" id="game_submit" name="game[submit]">Submit</button>' +
    '   </div>' +
    '</form>'

const nestedCollection = '' +
    '    <template id="addButton">' +
    '        <button type="button" class="add-button">Add button</button>' +
    '    </template>' +
    '' +
    '    <template id="deleteButton">' +
    '        <button type="button" class="delete-button">Delete button</button>' +
    '    </template>' +
    '' +
    '<form name="game" method="post" data-controller="symfony--ux-collection--collection" data-add-button="addButton" data-delete-button="deleteButton">' +
    '   <div id="game">' +
    '       <div>' +
    '           <label class="required">Teams</label>' +
    '           <div id="game_teams" data-prototype="&lt;div class=&quot;team-entry&quot;&gt;&lt;label class=&quot;required&quot;&gt;__name__label__&lt;/label&gt;&lt;div id=&quot;game_teams___name__&quot;&gt;&lt;div&gt;&lt;label for=&quot;game_teams___name___name&quot; class=&quot;required&quot;&gt;Name&lt;/label&gt;&lt;input type=&quot;text&quot; id=&quot;game_teams___name___name&quot; name=&quot;game[teams][__name__][name]&quot; required=&quot;required&quot; data-controller=&quot;test&quot; /&gt;&lt;/div&gt;&lt;div&gt;&lt;label class=&quot;required&quot;&gt;Players&lt;/label&gt;&lt;div id=&quot;game_teams___name___players&quot; data-prototype=&quot;&amp;lt;div class=&amp;&quot;player-entry&amp;&quot;&amp;gt;&amp;lt;label class=&amp;quot;required&amp;quot;&amp;gt;__name__label__&amp;lt;/label&amp;gt;&amp;lt;div id=&amp;quot;game_teams___name___players___name__&amp;quot;&amp;gt;&amp;lt;div&amp;gt;&amp;lt;label for=&amp;quot;game_teams___name___players___name___firstName&amp;quot; class=&amp;quot;required&amp;quot;&amp;gt;First name&amp;lt;/label&amp;gt;&amp;lt;input type=&amp;quot;text&amp;quot; id=&amp;quot;game_teams___name___players___name___firstName&amp;quot; name=&amp;quot;game[teams][__name__][players][__name__][firstName]&amp;quot; required=&amp;quot;required&amp;quot; /&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;&amp;lt;label for=&amp;quot;game_teams___name___players___name___lastName&amp;quot; class=&amp;quot;required&amp;quot;&amp;gt;Last name&amp;lt;/label&amp;gt;&amp;lt;input type=&amp;quot;text&amp;quot; id=&amp;quot;game_teams___name___players___name___lastName&amp;quot; name=&amp;quot;game[teams][__name__][players][__name__][lastName]&amp;quot; required=&amp;quot;required&amp;quot; /&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;/div&amp;gt;&quot;&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;">' +
    '           </div>' +
    '       </div>' +
    '   <div>' +
    '   <button type="submit" id="game_submit" name="game[submit]">Submit</button>' +
    '   </div>' +
    '</form>'

/* eslint-disable no-undef */
describe('CollectionController', () => {
    startStimulus();

    afterEach(() => {
        clearDOM();
    });

    it('connects', async () => {
        const container = mountDOM(emptyCollection);

        // smoke test
        expect(getByTestId(container, 'collection')).toHaveAttribute('data-controller', 'symfony--ux-collection--collection');
    });

    it('should create a add button when no button given', async () => {
        const container = mountDOM(simpleCollectionWithoutButtons);

        const element = await waitFor(() => getByText(container, 'Add'));

        expect(element).toBeInTheDocument();
    });

    it('should create a add button when button is given', async () => {
        const container = mountDOM(simpleCollection);

        const element = await waitFor(() => getByText(container, 'Add button'));

        expect(element).toBeInTheDocument();
    });

    it('should create new collection on click on add button', async () => {
        const container = mountDOM(simpleCollection);

        await waitFor(() => getByText(container, 'Add button'));

        fireEvent(
            getByText(container, 'Add button'),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }),
        )

        expect(container.querySelectorAll('.team-entry').length).toBe(1);
    });

    it('should remove collection on click on delete button', async () => {
        const container = mountDOM(simpleCollection);

        await waitFor(() => getByText(container, 'Add button'));

        fireEvent(
            getByText(container, 'Add button'),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }),
        )

        expect(container.querySelectorAll('.team-entry').length).toBe(1);

        await waitFor(() => getByText(container, 'Delete button'));

        fireEvent(
            getByText(container, 'Delete button'),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }),
        )

        expect(container.querySelectorAll('.team-entry').length).toBe(0);
    });
});
