(function(_0xAdmin) {
    const _0xMap = {
        'v': 'viewMode', 'l': 'list', 'c': 'confirmModal', 'm': 'confirmMessage',
        'e': 'confirmExecuteBtn', 'n': 'navRight', 'u': 'hpc_user', 'r': 'hpc_role',
        'a': 'accountList', 't': 'toastContainer', 's': ' Asia/Ho_Chi_Minh',
        'err': '\x55\x6e\x61\x62\x6c\x65\x20\x74\x6f\x20\x6c\x6f\x61\x64\x20\x64\x61\x74\x61', 
        'msg': '\x53\x65\x73\x73\x69\x6f\x6e\x20\x65\x78\x70\x69\x72\x65\x64'
    };
    let _0xView = localStorage.getItem(_0xMap.v) || _0xMap.l;

    window.formatSize = function(_0xBytes) {
        if (_0xBytes === 0) return '0 B';
        const _k = 1024, _s = ['B', 'KB', 'MB', 'GB', 'TB'];
        const _i = Math.floor(Math.log(_0xBytes) / Math.log(_k));
        return parseFloat((_0xBytes / Math.pow(_k, _i)).toFixed(2)) + ' ' + _s[_i];
    };

    window.showAlert = function(_type, _msg, _dur = 2000) {
        let _cont = document.getElementById('alert-container') || (function() {
            let _c = document.createElement('div');
            _c.id = 'alert-container';
            _c.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none';
            document.body.appendChild(_c);
            return _c;
        })();
        const _cfg = {
            success: 'bg-emerald-500', error: 'bg-rose-500', info: 'bg-indigo-500'
        }[_type] || 'bg-indigo-500';
        const _node = document.createElement('div');
        _node.className = `flex items-center gap-3 px-4 py-3 rounded-2xl text-white shadow-2xl transition-all duration-500 ${_cfg}`;
        _node.innerHTML = `<div class="flex-1"><p class="text-sm font-medium">${_msg}</p></div>`;
        _cont.appendChild(_node);
        setTimeout(() => _node.remove(), _dur);
    };

    window.api = async function(_path, _opt = {}) {
        const _h = { ..._opt.headers };
        if (!(_opt.body instanceof FormData)) _h['Content-Type'] = 'application/json';
        try {
            const _res = await fetch(_path, { ..._opt, headers: _h, credentials: 'include' });
            if (_res.status === 401) {
                window.showAlert("error", _0xMap.msg);
                window.logout();
                throw new Error(_0xMap.msg);
            }
            return _res;
        } catch (_e) { throw _e; }
    };

    window.logout = async function() {
        try { await fetch('/api/logout', { credentials: 'include' }); } catch (e) {}
        localStorage.clear();
        window.location.href = '/login';
    };

    window.loadData = async function() {
        try {
            const _r = await window.api('/api/servers');
            const _d = await _r.json();
            const _accs = _d.accounts || [];
            
            const _list = document.getElementById(_0xMap.a);
            if (!_list) return;

            _list.innerHTML = _accs.map(_a => {
                const _p = ((_a.used_space / _a.total_space) * 100).toFixed(2);
                return `<div class="group bg-[#0f172a]/60 p-5 rounded-[2rem] border border-white/5">
                            <h4 class="font-bold text-sm text-indigo-100">${_a.name}</h4>
                            <div class="w-full bg-white/5 h-1.5 rounded-full mt-2">
                                <div class="bg-indigo-500 h-full" style="width: ${_p}%"></div>
                            </div>
                            <p class="text-[9px] mt-2">${window.formatSize(_a.used_space)} / ${window.formatSize(_a.total_space)}</p>
                        </div>`;
            }).join('');
        } catch (_err) {
            console.error(_err);
            if (window.showToast) window.showToast(_0xMap.err, "error");
        }
    };

    // Khởi tạo
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof updateAuthUI === 'function') updateAuthUI();
        window.loadData();
    });

})(window);
