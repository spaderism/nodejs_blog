'use strict';

const pm2 = require('pm2');
const path = require('path');
const prettyjson = require('prettyjson');


class AppControlConfig {
	static init() {
		const dirname = __dirname;
		const defaultAppPath = path.join(`${dirname}/..`);

		this.appPath = process.env.NODE_PATH || defaultAppPath;

		console.log(`[NODEBLOG] path set ${this.appPath}`);
	}

	static printConfig() {
		const config = AppControlConfig.getConfig();
		const prettyConfig = prettyjson.render(config, {
			defaultIndentation: 4,
			keyColor: 'blug',
			dashColor: 'yellow',
			numberColor: 'green'
		});

		console.log(`[NODEBLOG] print config\n ${prettyConfig}`);
        console.log();
	}

	static getConfig() {
		return {
			// General
            name: 'NODEBLOG',
            script: `${this.appPath}/bin/www`,
            interpreter: 'node',

            // Advanced features
            instances: 0,
            exec_mode: 'cluster',
            max_memory_restart: '150M',

            // Log files
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            error_file: `${this.appPath}/log/server/server.err.log`,
            out_file: `${this.appPath}/log/server/server.out.log`,
            merge_logs: true,
            pid_file: `${this.appPath}/pid/server.pid`,

            // Control flow
            min_uptime: '1000s',
            max_restarts: 10,
            autorestart: true,
            kill_timeout: 5000,
            restart_delay: 5000,
            listen_timeout: 5000,
            autorestart: true
		};
	}
}

class AppControl {
	static init() {
		AppControlConfig.init();
		AppControlConfig.printConfig();
		AppControl.connect();
	}

	static connect() {
		pm2.connect(false, (err) => {
			if (err) {
				console.error('[NODEBLOG] Err: %o', err);
                process.exit(2);
			}

			const commands = process.argv.slice(2);
			const command = commands[0] || '';

			switch (command) {
				case 'start':
					AppControl.start();
					break;
				case 'restart':
					AppControl.restart();
					break;
				case 'reload':
					AppControl.reload();
					break;
				case 'graceful':
					AppControl.graceful();
					break;
				case 'stop':
					AppControl.restart();
					break;
				case 'delete':
					AppControl.delete();
					break;
				case 'status':
					AppControl.status();
					break;
				default:
					pm2.disconnect();
					console.log('[NODEBLOG] not match command');
                    console.log('[NODEBLOG] usage {start|restart|graceful|stop|status|delete}');
                    process.exit(0);
                    break;
			}
		});
	}

	static start() {
		pm2.start(AppControlConfig.getConfig(), (err, apps) => {
			pm2.disconnect();

			if (err) {
				console.error('[NODEBLOG] Err: %o', err);
                throw err;
			}

			console.log('[NODEBLOG] start completed');
		});
	}

	static restart() {
		pm2.restart(AppControlConfig.getConfig(), (err, apps) => {
			pm2.disconnect();

			if (err) {
				console.error('[NODEBLOG] Err: %o', err);
                throw err;
			}

			console.log('[NODEBLOG] restart completed');
		});
	}

	static reload() {
		pm2.reload(AppControlConfig.getConfig().name, (err, procs) => {
			pm2.disconnect();
			if (err) {
				console.error('[NODEBLOG] Err: %o', err);
                throw err;
			}

			console.log('[NODEBLOG] reload completed');
		});
	}

	static graceful() {
		pm2.gracefulReload(AppControlConfig.getConfig().name, (err, procs) => {
			pm2.disconnect();
			if (err) {
				console.error('[NODEBLOG] Err: %o', err);
                throw err;
			}

			console.log('[NODEBLOG] gracefulReload completed');
		});
	}

	static stop() {
		pm2.stop(AppControlConfig.getConfig().name, (err, procs) => {
			pm2.disconnect();
			if (err) {
				console.error('[NODEBLOG] Err: %o', err);
                throw err;
			}

			console.log('[NODEBLOG] stop completed');
		});
	}

	static delete() {
		pm2.delete(AppControlConfig.getConfig().name, (err, procs) => {
			pm2.disconnect();
			if (err) {
				console.error('[NODEBLOG] Err: %o', err);
                throw err;
			}

			console.log('[NODEBLOG] delete completed');
		});
	}
}

AppControl.init();
