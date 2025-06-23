import React from 'react';
import { Info } from 'lucide-react';

const ShortcutItem = ({ keys, description }) => (
    <div className="flex items-center gap-1">
        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{keys}</kbd>
        <span>{description}</span>
    </div>
);

const KeyboardShortcuts = ({ shortcuts = [] }) => {
    const defaultShortcuts = [
        { keys: 'Alt + A', description: 'Add Problem' },
        { keys: 'Alt + P', description: 'Create Plan' },
        { keys: 'Alt + T', description: 'Go to Today' },
        { keys: 'Alt + H', description: 'Dashboard' },
        { keys: 'Alt + R', description: 'Resources' },
    ];

    const displayShortcuts = shortcuts.length > 0 ? shortcuts : defaultShortcuts;

    return (
        <div className="bg-white rounded-xl border-2 border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">Quick Actions</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    {displayShortcuts.slice(0, 3).map((shortcut, index) => (
                        <ShortcutItem
                            key={index}
                            keys={shortcut.keys}
                            description={shortcut.description}
                        />
                    ))}
                    {displayShortcuts.length > 3 && (
                        <span className="text-gray-400">+{displayShortcuts.length - 3} more</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcuts;